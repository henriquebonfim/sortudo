/* eslint-disable no-console */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { calculateAllStats } from '../src/workers/analytics/engine';
import type { Game } from '../src/workers/core/types';
import { parseExcelToGames } from '../src/workers/parser/engine';

const FILE_PATH = './scripts/Mega-Sena.xlsx';
const OUTPUT_PATH = './public/data.json';

/**
 * Synchronizes official Mega-Sena XLSX data into a minified data.json.
 * This runs during build time to ensure the app has latest records.
 */
async function sync() {
  if (!existsSync(FILE_PATH)) {
    console.warn(`⚠️ Warning: ${FILE_PATH} NOT found. Skipping static data sync.`);
    process.exit(0);
  }

  try {
    console.info(`📂 Reading ${FILE_PATH}...`);
    const data = readFileSync(FILE_PATH);

    console.info('🧪 Parsing Excel contents...');
    const draws: Game[] = parseExcelToGames(data);

    if (draws.length === 0) {
      throw new Error('No draws were parsed from the Excel file.');
    }

    console.info(`📊 Calculating statistics for ${draws.length} draws...`);
    const stats = calculateAllStats(draws);

    const metadata = {
      totalGames: draws.length,
      firstGameDate: draws[0].date,
      lastGameDate: draws[draws.length - 1].date,
      lastUpdate: new Date().toISOString(),
    };

    const output = {
      draws,
      stats,
      metadata,
      sync_at: new Date().toISOString(),
    };

    console.info(`💾 Writing minified JSON to ${OUTPUT_PATH}...`);
    // Minify JSON to save bytes (no spaces)
    writeFileSync(OUTPUT_PATH, JSON.stringify(output));

    console.info(`✅ Success! Synchronized ${draws.length} records.`);
  } catch (err) {
    console.error(`❌ ERROR: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

sync();
