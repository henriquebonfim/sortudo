import { createModuleWorker, registerValidatedWorkerHandler } from '@/workers/worker-runtime';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

type PingCommand = {
  id: string;
  type: 'PING';
  payload: { value: number };
};

describe('worker runtime helpers', () => {
  it('creates module workers with URL and module type', () => {
    const workerCtorSpy = vi.fn();
    class WorkerMock {
      constructor(url: URL, options: WorkerOptions) {
        workerCtorSpy(url, options);
      }
    }
    vi.stubGlobal('Worker', WorkerMock as unknown as typeof Worker);

    const url = new URL('file:///tmp/worker.ts');
    createModuleWorker(url);

    expect(workerCtorSpy).toHaveBeenCalledWith(url, { type: 'module' });

    vi.unstubAllGlobals();
  });

  it('posts validation errors when incoming command payload is invalid', async () => {
    const postMessage = vi.fn();
    vi.stubGlobal('self', {
      onmessage: null,
      postMessage,
    } as unknown as WorkerGlobalScope & typeof globalThis);

    const handleCommand = vi.fn();

    registerValidatedWorkerHandler<PingCommand, { id: string; type: string; payload: unknown }>({
      requestSchema: z.object({
        id: z.string().min(1),
        type: z.literal('PING'),
        payload: z.object({ value: z.number().int() }),
      }),
      invalidPayloadMessage: 'Invalid payload',
      unknownErrorMessage: 'Unknown error',
      handleCommand,
    });

    await (
      globalThis.self as unknown as { onmessage: (event: MessageEvent) => Promise<void> }
    ).onmessage({
      data: { id: 'req-1', type: 'PING', payload: { value: 'bad' } },
    } as MessageEvent);

    expect(handleCommand).not.toHaveBeenCalled();
    expect(postMessage).toHaveBeenCalledTimes(1);
    const [firstMessage] = postMessage.mock.calls[0];
    expect(firstMessage).toMatchObject({ id: 'req-1', type: 'ERROR' });
    expect((firstMessage as { error: string }).error).toContain('expected number');

    vi.unstubAllGlobals();
  });

  it('posts successful responses for valid commands', async () => {
    const postMessage = vi.fn();
    vi.stubGlobal('self', {
      onmessage: null,
      postMessage,
    } as unknown as WorkerGlobalScope & typeof globalThis);

    registerValidatedWorkerHandler<PingCommand, { id: string; type: string; payload: unknown }>({
      requestSchema: z.object({
        id: z.string().min(1),
        type: z.literal('PING'),
        payload: z.object({ value: z.number().int() }),
      }),
      invalidPayloadMessage: 'Invalid payload',
      unknownErrorMessage: 'Unknown error',
      handleCommand: ({ id, payload }) => ({ id, type: 'PONG', payload }),
    });

    await (
      globalThis.self as unknown as { onmessage: (event: MessageEvent) => Promise<void> }
    ).onmessage({
      data: { id: 'req-2', type: 'PING', payload: { value: 10 } },
    } as MessageEvent);

    expect(postMessage).toHaveBeenCalledWith({
      id: 'req-2',
      type: 'PONG',
      payload: { value: 10 },
    });

    vi.unstubAllGlobals();
  });

  it('posts unknown error messages when command handler throws non-Error values', async () => {
    const postMessage = vi.fn();
    vi.stubGlobal('self', {
      onmessage: null,
      postMessage,
    } as unknown as WorkerGlobalScope & typeof globalThis);

    registerValidatedWorkerHandler<PingCommand, { id: string; type: string; payload: unknown }>({
      requestSchema: z.object({
        id: z.string().min(1),
        type: z.literal('PING'),
        payload: z.object({ value: z.number().int() }),
      }),
      invalidPayloadMessage: 'Invalid payload',
      unknownErrorMessage: 'Unknown error',
      handleCommand: () => {
        throw 'raw-failure';
      },
    });

    await (
      globalThis.self as unknown as { onmessage: (event: MessageEvent) => Promise<void> }
    ).onmessage({
      data: { id: 'req-3', type: 'PING', payload: { value: 1 } },
    } as MessageEvent);

    expect(postMessage).toHaveBeenCalledWith({
      id: 'req-3',
      type: 'ERROR',
      error: 'Unknown error',
    });

    vi.unstubAllGlobals();
  });
});
