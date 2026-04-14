import { z } from 'zod';

export const WORKER_ERROR_TYPE = 'ERROR' as const;

const WorkerMessageIdSchema = z.string().min(1);
const WorkerMessageTypeSchema = z.string().min(1);
const WorkerSuccessTypeSchema = WorkerMessageTypeSchema.refine(
  (value) => value !== WORKER_ERROR_TYPE,
  'Success response type cannot be ERROR'
);
const WorkerSuccessPayloadSchema = z
  .unknown()
  .refine((value) => value !== undefined, 'Success response payload is required');

const WorkerSuccessEnvelopeSchema = z.object({
  id: WorkerMessageIdSchema,
  type: WorkerSuccessTypeSchema,
  payload: WorkerSuccessPayloadSchema,
});

const WorkerErrorResponseSchema = z.object({
  id: WorkerMessageIdSchema,
  type: z.literal(WORKER_ERROR_TYPE),
  error: z.string(),
});

export const WorkerResponseEnvelopeSchema = z.union([
  WorkerSuccessEnvelopeSchema,
  WorkerErrorResponseSchema,
]);

export interface WorkerRequest<TType extends string, TPayload> {
  id: string;
  type: TType;
  payload: TPayload;
}

export interface WorkerSuccessResponse<TType extends string, TPayload> {
  id: string;
  type: TType;
  payload: TPayload;
}

interface WorkerErrorResponse {
  id: string;
  type: typeof WORKER_ERROR_TYPE;
  error: string;
}

export function createWorkerCommandSchema<TType extends string, TPayload>(
  typeSchema: z.ZodType<TType>,
  payloadSchema: z.ZodType<TPayload>
) {
  return z.object({
    type: typeSchema,
    payload: payloadSchema,
  });
}

export function createWorkerRequestSchema<TType extends string, TPayload>(
  typeSchema: z.ZodType<TType>,
  payloadSchema: z.ZodType<TPayload>
) {
  return z.object({
    id: WorkerMessageIdSchema,
    type: typeSchema,
    payload: payloadSchema,
  });
}

export function createWorkerErrorResponse(
  id: string,
  error: unknown,
  fallbackMessage: string
): WorkerErrorResponse {
  return {
    id,
    type: WORKER_ERROR_TYPE,
    error: error instanceof Error ? error.message : fallbackMessage,
  };
}
