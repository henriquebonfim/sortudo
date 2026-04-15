import { expect, test } from '@playwright/test';

test.describe('generate page regression suite', () => {
  test('renders core screen contracts and controls', async ({ page }) => {
    await page.goto('/gerador');

    await expect(page.getByRole('heading', { name: /Gerador da Sorte/i })).toBeVisible();
    await expect(
      page.getByText(/Análise estatística avançada para suas dezenas favoritas\./i)
    ).toBeVisible();

    await expect(page.getByText(/Método/i)).toBeVisible();
    await expect(page.getByText(/Distribuição par\/ímpar/i)).toBeVisible();

    await expect(page.getByRole('button', { name: /Sorte/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Quentes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Frios/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /3 Ímpares.*3 Pares/i })).toBeVisible();

    await expect(page.getByRole('button', { name: /Compartilhar no WhatsApp/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Seus jogos \(0\)/i })).toBeVisible();

    const generateButton = page.getByRole('button', { name: /Gerar Combinação|Gerando.../i });
    await expect(generateButton).toBeEnabled({ timeout: 30000 });
  });

  test('runs full generation pipeline and history flow', async ({ page }) => {
    await page.goto('/gerador');

    const generateButton = page.getByRole('button', { name: /Gerar Combinação|Gerando.../i });
    await expect(generateButton).toBeEnabled({ timeout: 30000 });

    await page.getByRole('button', { name: /3 Ímpares.*3 Pares/i }).click();
    await generateButton.click();

    const ballValues = page.locator('.lottery-ball span');
    await expect(ballValues).toHaveCount(6);

    await expect
      .poll(
        async () => {
          const values = (await ballValues.allTextContents()).map((value) => value.trim());
          return {
            allTwoDigits: values.every((value) => /^\d{2}$/.test(value)),
            allDistinct: new Set(values).size === 6,
          };
        },
        { timeout: 20000 }
      )
      .toEqual({ allTwoDigits: true, allDistinct: true });

    await expect(page.getByText(/31% dos sorteios/i)).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole('heading', { name: /Combinação (já foi sorteada!|nunca foi sorteada!)/i })
    ).toBeVisible({ timeout: 30000 });

    const historyButton = page.getByRole('button', { name: /Seus jogos \([1-9]\d*\)/i });
    await expect(historyButton).toBeVisible();
    await historyButton.click();

    const clearButton = page.getByRole('button', { name: /Limpar/i });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    await expect(page.getByRole('button', { name: /Seus jogos \(0\)/i })).toBeVisible();
  });
});
