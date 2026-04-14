import { expect, test } from '@playwright/test';

test('generate page creates a 6-number combination', async ({ page }) => {
  await page.goto('/gerador');

  await expect(page.getByRole('heading', { name: /Gerador da Sorte/i })).toBeVisible();

  const generateButton = page.getByRole('button', { name: /Gerar Combinação|Gerando.../i });
  await expect(generateButton).toBeEnabled({ timeout: 30000 });

  await generateButton.click();

  const ballValues = page.locator('.lottery-ball span');
  await expect(ballValues).toHaveCount(6);

  await expect
    .poll(
      async () => {
        const values = (await ballValues.allTextContents()).map((value) => value.trim());
        return values.every((value) => /^\d{2}$/.test(value));
      },
      { timeout: 15000 }
    )
    .toBe(true);
});
