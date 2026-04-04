import { test, expect } from '@playwright/test';

test.describe('Main User Flow E2E', () => {
  test('should navigate through the scrollytelling flow and use interactive features', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page.getByText(/A sorte é um erro de cálculo/i)).toBeVisible();

    // 2. Navigate to Generator (it's a separate page now)
    const mainNav = page.getByLabel('Navegação principal');
    await mainNav.getByRole('link', { name: 'Gerador' }).click();
    await expect(page).toHaveURL(/\/gerador/);
    await expect(page.getByText(/Gerador da Sorte/i)).toBeVisible();

    // 3. Generate a game
    await page.getByRole('button', { name: 'Gerar Combinação' }).click();
    // Wait for animation (shuffle ticks)
    await page.waitForTimeout(2000); 
    
    // Check that we have 6 generated balls
    await expect(page.locator('.lottery-ball')).toHaveCount(6, { timeout: 20000 });

    // 4. Navigate to Search
    await mainNav.getByRole('link', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/buscar/);
    await expect(page.getByRole('heading', { name: 'Já fui sorteado?' })).toBeVisible();

    // 5. Perform a Search
    const numbers = ['04', '05', '30', '33', '41', '52'];
    for (let i = 0; i < 6; i++) {
        await page.locator('input[type="text"]').nth(i).fill(numbers[i]);
    }
    
    const searchBtn = page.getByRole('button', { name: /buscar/i });
    await expect(searchBtn).toBeEnabled();
    await searchBtn.click();
    
    // Check results and URL navigation
    const resultBanner = page.getByText(/nunca acertou a sena|já saiu/i);
    await expect(resultBanner).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/buscar\/04-05-30-33-41-52/);

    // 6. Navigate back to Home and scroll to Math
    await page.goto('/');
    const mathHeader = page.getByText(/A Matemática da Sorte/i);
    await mathHeader.scrollIntoViewIfNeeded();
    await expect(mathHeader).toBeVisible();
    await expect(page.getByText(/Probabilidade de Ganhar/i)).toBeVisible();
  });
});
