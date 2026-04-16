import { expect, test } from '@playwright/test';

test.describe('search page regression suite', () => {
  test('renders all core controls and initial state', async ({ page }) => {
    await page.goto('/buscar');

    await expect(page.getByRole('heading', { name: /Já fui sorteado\?/i })).toBeVisible();
    await expect(page.getByText(/sorteios e descubra se sua combinação/i)).toBeVisible();

    await expect(page.locator('#search-type-numbers')).toBeVisible();
    await expect(page.locator('#search-type-contest')).toBeVisible();

    const numberInputs = page.locator('[id^="search-number-input-"]');
    await expect(numberInputs).toHaveCount(6);

    const submitButton = page.locator('#search-submit-button');
    await expect(submitButton).toBeDisabled();
  });

  test('runs full numbers search pipeline with validation checks', async ({ page }) => {
    await page.goto('/buscar');

    const submitButton = page.locator('#search-submit-button');

    for (let i = 0; i < 6; i++) {
      await page.locator(`#search-number-input-${i}`).fill('1');
    }

    await expect(page.getByText(/Números repetidos não são permitidos\./i)).toBeVisible();
    await expect(submitButton).toBeDisabled();

    for (const [i, value] of ['1', '2', '3', '4', '5', '6'].entries()) {
      await page.locator(`#search-number-input-${i}`).fill(value);
    }

    await expect(page.getByText(/Números repetidos não são permitidos\./i)).toHaveCount(0);
    await expect(submitButton).toBeEnabled({ timeout: 30000 });

    await submitButton.click();

    await expect(page).toHaveURL(/\/buscar\/1-2-3-4-5-6$/);
    await expect(
      page.getByRole('heading', { name: /Combinação (já foi sorteada!|nunca foi sorteada!)/i })
    ).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: /Compartilhe este jogo\.\.\./i })).toBeVisible();
  });

  test('runs full contest search pipeline by contest id', async ({ page }) => {
    await page.goto('/buscar');

    const contestModeButton = page.locator('#search-type-contest');
    await contestModeButton.click();

    const contestRangeLabel = page.locator('p', {
      hasText: /DIGITE O NÚMERO DO CONCURSO/i,
    });
    await expect(contestRangeLabel).toBeVisible();

    await expect
      .poll(
        async () => {
          const text = (await contestRangeLabel.textContent()) ?? '';
          const match = text.match(/\(1–([0-9.]+)\)/);
          return match ? Number(match[1].replace(/\./g, '')) : 0;
        },
        { timeout: 30000 }
      )
      .toBeGreaterThan(0);

    const contestInput = page.locator('#search-contest-id');
    await expect
      .poll(
        async () => {
          await contestInput.fill('1');
          return contestInput.inputValue();
        },
        { timeout: 15000 }
      )
      .toBe('1');

    const submitButton = page.locator('#search-submit-button');
    await expect(submitButton).toBeEnabled({ timeout: 30000 });
    await submitButton.click();

    await expect(page).toHaveURL(/\/buscar\/#1$/);
    await expect(page.getByRole('heading', { name: /Concurso #1/i })).toBeVisible({
      timeout: 30000,
    });
    await expect(
      page.getByText(
        /Confira o resultado oficial e as estatísticas de premiação para este concurso\./i
      )
    ).toBeVisible();
  });
});
