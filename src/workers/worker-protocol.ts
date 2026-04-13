export const WORKER_ERROR_TYPE = 'ERROR' as const;

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
