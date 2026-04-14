/* eslint-disable no-console */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { calculateAllStats } from '../src/workers/analytics/engine';
import type { Game } from '../src/workers/core/types';
import { parseExcelToGames } from '../src/workers/parser/engine';

const FILE_PATH = './scripts/Mega-Sena.xlsx';
const OUTPUT_PATH = './public/data.json';

type SyncPayload = {
  draws: Game[];
  stats: ReturnType<typeof calculateAllStats>;
  metadata: {
    totalGames: number;
    firstGameDate: string;
    lastGameDate: string;
    lastUpdate: string;
  };
  sync_at: string;
};

/**
 * ELT (Extract, Load, Transform)
 * Synchronizes official Mega-Sena XLSX data into a minified data.json.
 * This runs during build time to ensure the app has latest records.
 */
function ensureSourceExists(filePath: string) {
  if (!existsSync(filePath)) {
    console.warn(`⚠️ Warning: ${filePath} NOT found. Skipping static data sync.`);
    process.exit(0);
  }
}

function extract(filePath: string): Buffer {
  console.info(` 📂 [Extract] Reading ${filePath}...`);
  return readFileSync(filePath);
}

function load(excelData: Buffer): Game[] {
  console.info(' 🧪 [Load] Parsing Excel contents...');
  const draws = parseExcelToGames(excelData);

  if (draws.length === 0) {
    throw new Error('No draws were parsed from the Excel file.');
  }

  return draws;
}

function transform(draws: Game[]): SyncPayload {
  console.info(` 📊 [Transform] Calculating statistics for ${draws.length} draws...`);

  const stats = calculateAllStats(draws);
  const now = new Date().toISOString();

  return {
    draws,
    stats,
    metadata: {
      totalGames: draws.length,
      firstGameDate: draws[0].date,
      lastGameDate: draws[draws.length - 1].date,
      lastUpdate: now,
    },
    sync_at: now,
  };
}

function persist(outputPath: string, payload: SyncPayload) {
  console.info(` 💾 [Persist] Writing minified JSON to ${outputPath}...`);
  // Minify JSON to save bytes (no spaces)
  writeFileSync(outputPath, JSON.stringify(payload));
}

function main() {
  ensureSourceExists(FILE_PATH);

  try {
    const extractedExcel = extract(FILE_PATH);
    const loadedDraws = load(extractedExcel);
    const transformedPayload = transform(loadedDraws);
    persist(OUTPUT_PATH, transformedPayload);

    console.info(` ✅ [Output] Success! Synchronized ${loadedDraws.length} records.`);
  } catch (err) {
    console.error(` ❌ ERROR: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
