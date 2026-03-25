import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Data Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dados');
    // Wait for data to load (stats should be visible)
    await expect(page.getByText('Dashboard Analítico')).toBeVisible({ timeout: 10000 });
  });

  test('should display all 6 infographic chapters', async ({ page }) => {
    // 1. Números
    await expect(page.getByText('Números', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Frequência', { exact: true }).first()).toBeVisible();

    // 2. Temporalidade
    await expect(page.getByText('Temporalidade', { exact: true }).first()).toBeVisible();

    // 3. Probabilidade
    await expect(page.getByText('Probabilidade', { exact: true }).first()).toBeVisible();

    // 4. Finanças
    await expect(page.getByText('Finanças', { exact: true }).first()).toBeVisible();

    // 5. Geografia
    await expect(page.getByText('Geografia', { exact: true }).first()).toBeVisible();

    // 6. Metodologia
    await expect(page.getByText('Metodologia', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Fluxo de Dados', { exact: true }).first()).toBeVisible();
  });

  test('should display correctly themed badges and icons', async ({ page }) => {
    // Check for TypeBadges
    await expect(page.getByText('Statistical').first()).toBeVisible();
    await expect(page.getByText('Timeline').first()).toBeVisible();
    await expect(page.getByText('Comparison').first()).toBeVisible();
    await expect(page.getByText('Geographic').first()).toBeVisible();
    await expect(page.getByText('Process').first()).toBeVisible();
  });

  test('should show KPI card stats with real data', async ({ page }) => {
    // We expect around 2983 draws in data.json
    await expect(page.getByText(/2[.,]98/).first()).toBeVisible(); 
  });
});
