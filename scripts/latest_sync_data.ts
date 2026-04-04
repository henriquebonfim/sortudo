/* eslint-disable no-console */
import * as fs from 'fs';
import { DrawMapper } from '../src/domain/lottery/draw';
import { StatisticsService } from '../src/domain/lottery/services';
import { parseExcelToDraws } from '../src/infrastructure/parser/index';

const FILE_PATH = './scripts/Mega-Sena.xlsx';
const OUTPUT_PATH = './public/data.json';

/**
 * Synchronizes official Mega-Sena XLSX data into a minified data.json.
 * This runs during build time to ensure the app has latest records.
 */
async function sync() {
  if (!fs.existsSync(FILE_PATH)) {
    console.warn(`⚠️ Warning: ${FILE_PATH} NOT found. Skipping static data sync.`);
    process.exit(0);
  }

  try {
    console.info(`📂 Reading ${FILE_PATH}...`);
    const data = fs.readFileSync(FILE_PATH);

    console.info('🧪 Parsing Excel contents...');
    const draws = parseExcelToDraws(data);

    if (draws.length === 0) {
      throw new Error('No draws were parsed from the Excel file.');
    }

    console.info(`📊 Calculating statistics for ${draws.length} draws...`);
    const stats = StatisticsService.calculateAllStats(draws);
    const metadata = DrawMapper.extractMetadata({}, draws);

    const output = {
      draws,
      stats,
      metadata,
      sync_at: new Date().toISOString()
    };

    console.info(`💾 Writing minified JSON to ${OUTPUT_PATH}...`);
    // Minify JSON to save bytes (no spaces)
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output));

    console.info(`✅ Success! Synchronized ${draws.length} records.`);
  } catch (err) {
    console.error(`❌ ERROR: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

sync();
