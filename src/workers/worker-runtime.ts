import { createWorkerErrorResponse } from '@/workers/worker-protocol';
import type { ZodType } from 'zod';

interface WorkerCommand {
  id: string;
  type: string;
}

interface WorkerHandlerOptions<TCommand extends WorkerCommand, TResponse> {
  requestSchema: ZodType<TCommand>;
  invalidPayloadMessage: string;
  unknownErrorMessage: string;
  handleCommand: (command: TCommand) => Promise<TResponse> | TResponse;
}

export function createModuleWorker(workerModuleUrl: URL): Worker {
  return new Worker(workerModuleUrl, { type: 'module' });
}

export function registerValidatedWorkerHandler<TCommand extends WorkerCommand, TResponse>({
  requestSchema,
  invalidPayloadMessage,
  unknownErrorMessage,
  handleCommand,
}: WorkerHandlerOptions<TCommand, TResponse>): void {
  self.onmessage = async (event: MessageEvent<TCommand | unknown>) => {
    const commandResult = requestSchema.safeParse(event.data);
    if (!commandResult.success) {
      const rawId = (event.data as { id?: unknown } | null | undefined)?.id;
      const requestId = typeof rawId === 'string' ? rawId : 'unknown';
      self.postMessage(
        createWorkerErrorResponse(requestId, commandResult.error, invalidPayloadMessage)
      );
      return;
    }

    const command = commandResult.data;

    try {
      const response = await handleCommand(command);
      self.postMessage(response);
    } catch (error) {
      self.postMessage(createWorkerErrorResponse(command.id, error, unknownErrorMessage));
    }
  };
}
