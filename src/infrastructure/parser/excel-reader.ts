import * as XLSX from 'xlsx';
import { parseCaixaExcel } from '@/infrastructure/parser/caixa-excel-parser';
import { Draw } from '@/domain/lottery/draw.model';

/**
 * Reads an Excel file (as ArrayBuffer or Buffer) and parses it into Draw domain models.
 * Includes workarounds for Caixa's corrupted XLSX range headers.
 */
export function parseExcelToDraws(data: ArrayBuffer | Uint8Array): Draw[] {
  // Safe check for Buffer to avoid ReferenceError in browser/worker environments
  const globalObj = globalThis as unknown as { Buffer?: { isBuffer: (val: unknown) => boolean } };
  const isBuffer = typeof globalThis !== 'undefined' && globalObj.Buffer && globalObj.Buffer.isBuffer(data);
  const workbook = XLSX.read(data, { type: isBuffer ? 'buffer' : 'array' });

  if (!workbook.SheetNames.length) {
    throw new Error('The file is empty.');
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error('Could not find a valid worksheet.');
  }

  /**
   * WORKAROUND: Some official Caixa XLSX files have a corrupted or truncated "!ref" (range).
   * This causes sheet_to_json to only return the header row.
   * We manually scan the keys to find the REAL max row.
   */
  const cells = Object.keys(worksheet).filter(k => k[0] !== '!');
  let maxRow = 0;
  for (const cell of cells) {
    const rowNum = parseInt(cell.replace(/^[A-Z]+/, ''), 10);
    if (!isNaN(rowNum) && rowNum > maxRow) maxRow = rowNum;
  }

  // header: 1 returns an array of arrays (rows), which our parser needs
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false,
    // If we found rows beyond the !ref, force the range
    // We assume columns A-Z (0-25) are enough for Mega-Sena data
    range: maxRow > 0 ? { s: { c: 0, r: 0 }, e: { c: 25, r: maxRow } } : undefined
  });

  // This transforms the raw rows into the domain model (Draw[])
  const draws = parseCaixaExcel(rows as unknown[][]);
  draws.sort((a, b) => a.id - b.id);
  
  return draws;
}
