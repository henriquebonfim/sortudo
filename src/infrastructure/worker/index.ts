import type { SearchResult } from '@/domain/lottery/draw';
import { 
  WorkerCommand, 
  WorkerCommandType, 
  WorkerResponse, 
  SearchCombinationPayload 
} from './types';

import SearchWorker from './search.worker?worker';

export * from './types';

// ─── Worker Client ────────────────────────────────────────────────────────────

export class WorkerClient {
  private static instance: WorkerClient;
  private worker: Worker;
  private resolvers: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

  private constructor() {
    this.worker = new SearchWorker();
    
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { data } = event;
      const resolver = this.resolvers.shift();
      if (!resolver) return;

      if (data.type === 'ERROR') {
        resolver.reject(new Error(data.error));
      } else {
        resolver.resolve(data.payload);
      }
    };

    this.worker.onerror = (err) => {
      console.error('Worker error:', err);
      const resolver = this.resolvers.shift();
      if (resolver) resolver.reject(err);
    };
  }

  public static getInstance(): WorkerClient {
    if (!WorkerClient.instance) {
      WorkerClient.instance = new WorkerClient();
    }
    return WorkerClient.instance;
  }

  public searchCombination(payload: SearchCombinationPayload): Promise<SearchResult> {
    return new Promise((resolve, reject) => {
      this.resolvers.push({ resolve, reject });
      const command: WorkerCommand = {
        type: WorkerCommandType.SEARCH_COMBINATION,
        payload
      };
      this.worker.postMessage(command);
    });
  }
}
