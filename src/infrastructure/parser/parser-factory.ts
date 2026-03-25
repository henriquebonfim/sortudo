import { Draw } from '@/domain/lottery/draw.model';
import { parseCaixaExcel } from './caixa-excel-parser';

export type ParserType = 'caixa-excel' | 'caixa-json';

export class ParserFactory {
  static getParser(type: ParserType): (data: unknown[][]) => Draw[] {
    switch (type) {
      case 'caixa-excel':
        return parseCaixaExcel;
      case 'caixa-json':
        // Placeholder for future JSON parser
        return (data: unknown[][]) => data as unknown as Draw[];
      default:
        throw new Error(`Unsupported parser type: ${type}`);
    }
  }

  /**
   * Automatically detects the parser type based on data structure or file extension.
   */
  static detectAndParse(data: unknown): Draw[] {
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      return parseCaixaExcel(data as unknown[][]);
    }
    
    // Default fallback or more complex detection logic
    return data as Draw[];
  }
}
