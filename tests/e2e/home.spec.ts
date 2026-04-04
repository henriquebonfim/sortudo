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

    // Check for Metodologia / Matemática
    const mathHeader = page.getByText(/A Matemática da Sorte/i);
    await mathHeader.scrollIntoViewIfNeeded();
    await expect(mathHeader).toBeVisible();
    await expect(page.getByText(/Probabilidade de Ganhar/i)).toBeVisible();
  });
});
