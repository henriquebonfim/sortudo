import { FeatureWorkerClient } from '@/workers/worker-client';
import { WORKER_ERROR_TYPE } from '@/workers/worker-protocol';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

type TestCommand = {
  id: string;
  type: 'PING';
  payload: { value: number };
};

type TestResponse = {
  ok: boolean;
};

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  emitMessage(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }

  emitError(error: unknown) {
    this.onerror?.({ error } as ErrorEvent);
  }
}

const TestCommandSchema = z.object({
  type: z.literal('PING'),
  payload: z.object({ value: z.number().int().min(0) }),
});

const TestResponseSchema = z.object({
  ok: z.boolean(),
});

describe('FeatureWorkerClient', () => {
  it('resolves when worker responds with payload', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(worker as unknown as Worker);

    const request = client.send({ type: 'PING', payload: { value: 1 } });

    const [[message]] = worker.postMessage.mock.calls;
    worker.emitMessage({ id: message.id, type: 'PING', payload: { ok: true } });

    await expect(request).resolves.toEqual({ ok: true });
  });

  it('rejects when worker returns protocol error response', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(worker as unknown as Worker);

    const request = client.send({ type: 'PING', payload: { value: 1 } });

    const [[message]] = worker.postMessage.mock.calls;
    worker.emitMessage({ id: message.id, type: WORKER_ERROR_TYPE, error: 'boom' });

    await expect(request).rejects.toBe('boom');
  });

  it('rejects timed-out requests', async () => {
    vi.useFakeTimers();

    try {
      const worker = new FakeWorker();
      const client = new FeatureWorkerClient<TestCommand, TestResponse>(
        worker as unknown as Worker,
        100
      );

      const request = client.send({ type: 'PING', payload: { value: 1 } });
      const error = request.catch((err) => err);

      await vi.advanceTimersByTimeAsync(100);

      const resolvedError = (await error) as Error;
      expect(resolvedError).toBeInstanceOf(Error);
      expect(resolvedError.message).toContain('Worker request timed out after 100ms');
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects all pending requests when worker emits runtime error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(worker as unknown as Worker);

    try {
      const request = client.send({ type: 'PING', payload: { value: 1 } });
      const error = request.catch((err) => err);

      worker.emitError(new Error('worker crashed'));

      const resolvedError = (await error) as Error;
      expect(resolvedError).toBeInstanceOf(Error);
      expect(resolvedError.message).toContain('worker crashed');
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('rejects invalid commands before posting to worker', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(
      worker as unknown as Worker,
      45000,
      {
        commandSchema: TestCommandSchema,
      }
    );

    await expect(client.send({ type: 'PING', payload: { value: -1 } })).rejects.toThrow(
      'Invalid worker command payload:'
    );
    expect(worker.postMessage).not.toHaveBeenCalled();
  });

  it('rejects invalid response payloads', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(
      worker as unknown as Worker,
      45000,
      {
        responseSchema: TestResponseSchema,
      }
    );

    const request = client.send({ type: 'PING', payload: { value: 1 } });
    const [[message]] = worker.postMessage.mock.calls;
    worker.emitMessage({ id: message.id, type: 'PING', payload: { ok: 'invalid' } });

    await expect(request).rejects.toThrow('Invalid worker response payload:');
  });

  it('rejects malformed response envelopes immediately', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(worker as unknown as Worker);

    try {
      const request = client.send({ type: 'PING', payload: { value: 1 } });

      const [[message]] = worker.postMessage.mock.calls;
      worker.emitMessage({ id: message.id, type: 'PING' });

      await expect(request).rejects.toThrow('Invalid worker response envelope:');
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('falls back to Math.random ids when crypto.randomUUID is unavailable', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(
      worker as unknown as Worker,
      0
    );

    vi.stubGlobal('crypto', { getRandomValues: vi.fn() } as unknown as Crypto);

    try {
      const request = client.send({ type: 'PING', payload: { value: 1 } });

      const [[message]] = worker.postMessage.mock.calls;
      expect(message.id).toEqual(expect.any(String));

      worker.emitMessage({ id: message.id, type: 'PING', payload: { ok: true } });

      await expect(request).resolves.toEqual({ ok: true });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('logs and ignores malformed envelopes without request ids', async () => {
    vi.useFakeTimers();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const worker = new FakeWorker();
      const client = new FeatureWorkerClient<TestCommand, TestResponse>(
        worker as unknown as Worker,
        100
      );

      const request = client.send({ type: 'PING', payload: { value: 1 } });
      const rejection = request.catch((err) => err);

      const [[message]] = worker.postMessage.mock.calls;
      worker.emitMessage({ type: 'PING', payload: { ok: true } });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid worker response envelope',
        expect.any(Error),
        { type: 'PING', payload: { ok: true } }
      );

      await vi.advanceTimersByTimeAsync(100);

      const error = (await rejection) as Error;
      expect(error.message).toContain('Worker request timed out after 100ms');
      expect(message.id).toBeDefined();
    } finally {
      consoleErrorSpy.mockRestore();
      vi.useRealTimers();
    }
  });

  it('rejects when worker postMessage throws during send', async () => {
    const worker = new FakeWorker();
    worker.postMessage.mockImplementation(() => {
      throw new Error('post failed');
    });

    const client = new FeatureWorkerClient<TestCommand, TestResponse>(worker as unknown as Worker);

    await expect(client.send({ type: 'PING', payload: { value: 1 } })).rejects.toThrow(
      'post failed'
    );
    expect(worker.postMessage).toHaveBeenCalled();
  });

  it('terminates pending requests cleanly when no timeout is configured', async () => {
    const worker = new FakeWorker();
    const client = new FeatureWorkerClient<TestCommand, TestResponse>(
      worker as unknown as Worker,
      0
    );

    client.send({ type: 'PING', payload: { value: 1 } }).catch(() => undefined);

    client.terminate();

    expect(worker.terminate).toHaveBeenCalledTimes(1);
  });
});
