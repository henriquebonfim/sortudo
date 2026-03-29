import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display newly moved sections on home page', async ({ page }) => {
    // Check for Marcos Históricos
    const historyHeader = page.getByText(/Marcos.*Históricos/);
    await historyHeader.scrollIntoViewIfNeeded();
    await expect(historyHeader).toBeVisible();
    await expect(page.getByText('De 1996 aos dias atuais')).toBeVisible();

    // Check for Metodologia
    const methodologyHeader = page.getByText('Metodologia de Dados');
    await methodologyHeader.scrollIntoViewIfNeeded();
    await expect(methodologyHeader).toBeVisible();
    await expect(page.getByText('Fluxo de Processamento de Dados')).toBeVisible();
  });
});
