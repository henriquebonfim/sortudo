import { WORKER_ERROR_TYPE, WorkerResponseEnvelopeSchema } from '@/workers/worker-protocol';
import type { ZodType } from 'zod';

interface FeatureWorkerClientValidation<TCommand extends { id: string }, TResponse> {
  commandSchema?: ZodType<Omit<TCommand, 'id'>>;
  responseSchema?: ZodType<TResponse>;
}

/**
 * Generic Promise-based worker client for offloading heavy computations.
 * Each feature worker should extend this with specific commands and responses.
 */
export class FeatureWorkerClient<TCommand extends { id: string }, TResponse> {
  private worker: Worker;
  private commandSchema?: ZodType<Omit<TCommand, 'id'>>;
  private responseSchema?: ZodType<TResponse>;
  private pending: Map<
    string,
    {
      resolve: (res: TResponse) => void;
      reject: (err: unknown) => void;
      timeoutId: ReturnType<typeof setTimeout> | null;
    }
  > = new Map();
  private requestTimeoutMs: number;

  constructor(
    worker: Worker,
    requestTimeoutMs = 45000,
    validation: FeatureWorkerClientValidation<TCommand, TResponse> = {}
  ) {
    this.worker = worker;
    this.requestTimeoutMs = requestTimeoutMs;
    this.commandSchema = validation.commandSchema;
    this.responseSchema = validation.responseSchema;
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  private handleMessage(e: MessageEvent) {
    const rawData = (e.data || {}) as { id?: unknown };
    const possibleRequestId = typeof rawData.id === 'string' ? rawData.id : null;
    const envelopeResult = WorkerResponseEnvelopeSchema.safeParse(e.data);
    if (!envelopeResult.success) {
      console.error('Invalid worker response envelope', envelopeResult.error, e.data);

      if (possibleRequestId) {
        const request = this.pending.get(possibleRequestId);
        if (request) {
          if (request.timeoutId) {
            clearTimeout(request.timeoutId);
          }

          request.reject(
            new Error(`Invalid worker response envelope: ${envelopeResult.error.message}`)
          );
          this.pending.delete(possibleRequestId);
        }
      }

      return;
    }

    const envelope = envelopeResult.data;
    const { id } = envelope;
    const request = this.pending.get(id);
    if (!request) return;

    if (request.timeoutId) {
      clearTimeout(request.timeoutId);
    }

    if ('error' in envelope || envelope.type === WORKER_ERROR_TYPE) {
      request.reject('error' in envelope ? envelope.error : 'Unknown worker error');
    } else {
      if (this.responseSchema) {
        const payloadResult = this.responseSchema.safeParse(envelope.payload);
        if (!payloadResult.success) {
          request.reject(
            new Error(`Invalid worker response payload: ${payloadResult.error.message}`)
          );
          this.pending.delete(id);
          return;
        }
        request.resolve(payloadResult.data);
      } else {
        request.resolve(envelope.payload as TResponse);
      }
    }

    this.pending.delete(id);
  }

  private handleError(e: ErrorEvent) {
    console.error('Worker error:', e);
    const error = e.error || new Error('Worker execution failed');
    this.pending.forEach((req) => {
      if (req.timeoutId) {
        clearTimeout(req.timeoutId);
      }
      req.reject(error);
    });
    this.pending.clear();
  }

  /**
   * Sends a command to the worker and returns a promise for the result.
   */
  async send(command: Omit<TCommand, 'id'>, transfer: Transferable[] = []): Promise<TResponse> {
    const commandResult = this.commandSchema?.safeParse(command);
    if (commandResult && !commandResult.success) {
      return Promise.reject(
        new Error(`Invalid worker command payload: ${commandResult.error.message}`)
      );
    }

    const commandToSend = commandResult?.data ?? command;

    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(7);

    return new Promise((resolve, reject) => {
      const timeoutId =
        this.requestTimeoutMs > 0
          ? setTimeout(() => {
              const pendingRequest = this.pending.get(id);
              if (!pendingRequest) return;

              this.pending.delete(id);
              pendingRequest.reject(
                new Error(`Worker request timed out after ${this.requestTimeoutMs}ms`)
              );
            }, this.requestTimeoutMs)
          : null;

      this.pending.set(id, { resolve, reject, timeoutId });

      try {
        this.worker.postMessage({ ...commandToSend, id }, transfer);
      } catch (error) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  /**
   * Terminates the worker.
   */
  terminate() {
    this.pending.forEach((req) => {
      if (req.timeoutId) {
        clearTimeout(req.timeoutId);
      }
    });
    this.worker.terminate();
    this.pending.clear();
  }
}
