import { WORKER_ERROR_TYPE } from '@/workers/worker-protocol';

/**
 * Generic Promise-based worker client for offloading heavy computations.
 * Each feature worker should extend this with specific commands and responses.
 */
export class FeatureWorkerClient<TCommand extends { id: string }, TResponse> {
  private worker: Worker;
  private pending: Map<
    string,
    {
      resolve: (res: TResponse) => void;
      reject: (err: unknown) => void;
    }
  > = new Map();

  constructor(worker: Worker) {
    this.worker = worker;
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  private handleMessage(e: MessageEvent) {
    const { id, type, payload, error } = (e.data || {}) as {
      id?: string;
      type?: string;
      payload?: TResponse;
      error?: unknown;
    };

    if (!id) {
      return;
    }

    const request = this.pending.get(id);
    if (!request) return;

    if (type === WORKER_ERROR_TYPE || error) {
      request.reject(error || payload);
    } else {
      request.resolve(payload as TResponse);
    }

    this.pending.delete(id);
  }

  private handleError(e: ErrorEvent) {
    console.error('Worker error:', e);
    const error = e.error || new Error('Worker execution failed');
    this.pending.forEach((req) => req.reject(error));
    this.pending.clear();
  }

  /**
   * Sends a command to the worker and returns a promise for the result.
   */
  async send(command: Omit<TCommand, 'id'>, transfer: Transferable[] = []): Promise<TResponse> {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(7);

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ ...command, id }, transfer);
    });
  }

  /**
   * Terminates the worker.
   */
  terminate() {
    this.worker.terminate();
    this.pending.clear();
  }
}
