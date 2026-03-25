import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { parseExcelToDraws } from '@/infrastructure/parser/excel-reader';
import type { Draw } from '@/domain/lottery/draw.model';

// In ESM, __dirname is not available by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadRealData(): Draw[] {
  try {
    const filePath = path.join(__dirname, 'Mega-Sena-Test.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Excel file not found at ${filePath}`);
      return [];
    }

    const buffer = fs.readFileSync(filePath);
    const parsed = parseExcelToDraws(buffer);

    if (parsed.length === 0) {
      console.warn("Warning: parseExcelToDraws returned 0 draws from Mega-Sena-Test.xlsx");
    }
    return parsed;
  } catch (error) {
    console.error("Failed to load real data fixture from Excel:", error);
    return [];
  }
}

export const REAL_DRAWS: Draw[] = loadRealData();
