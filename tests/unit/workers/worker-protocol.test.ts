import {
  WORKER_ERROR_TYPE,
  WorkerResponseEnvelopeSchema,
  createWorkerCommandSchema,
  createWorkerErrorResponse,
  createWorkerRequestSchema,
} from '@/workers/worker-protocol';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('worker protocol', () => {
  it('creates command schema with strict type and payload validation', () => {
    const schema = createWorkerCommandSchema(
      z.literal('PING'),
      z.object({ value: z.number().int().nonnegative() })
    );

    expect(schema.parse({ type: 'PING', payload: { value: 1 } })).toEqual({
      type: 'PING',
      payload: { value: 1 },
    });
    expect(() => schema.parse({ type: 'PING', payload: { value: -1 } })).toThrow();
  });

  it('creates request schema that requires a non-empty id', () => {
    const schema = createWorkerRequestSchema(
      z.literal('PING'),
      z.object({ value: z.number().int() })
    );

    expect(schema.parse({ id: 'req-1', type: 'PING', payload: { value: 42 } })).toEqual({
      id: 'req-1',
      type: 'PING',
      payload: { value: 42 },
    });
    expect(() => schema.parse({ id: '', type: 'PING', payload: { value: 42 } })).toThrow();
  });

  it('accepts valid success and error envelopes and rejects malformed payloads', () => {
    const success = WorkerResponseEnvelopeSchema.safeParse({
      id: 'ok-1',
      type: 'PING',
      payload: { ok: true },
    });
    const error = WorkerResponseEnvelopeSchema.safeParse({
      id: 'err-1',
      type: WORKER_ERROR_TYPE,
      error: 'boom',
    });
    const malformed = WorkerResponseEnvelopeSchema.safeParse({
      id: 'bad-1',
      type: 'PING',
    });

    expect(success.success).toBe(true);
    expect(error.success).toBe(true);
    expect(malformed.success).toBe(false);
  });

  it('builds standardized error responses from error instances and unknown values', () => {
    expect(createWorkerErrorResponse('e1', new Error('explode'), 'fallback')).toEqual({
      id: 'e1',
      type: WORKER_ERROR_TYPE,
      error: 'explode',
    });

    expect(createWorkerErrorResponse('e2', 'raw', 'fallback')).toEqual({
      id: 'e2',
      type: WORKER_ERROR_TYPE,
      error: 'fallback',
    });
  });
});
