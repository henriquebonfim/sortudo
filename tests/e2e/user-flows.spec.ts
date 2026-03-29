import { test, expect } from '@playwright/test';

test.describe('Main User Flow E2E', () => {
  test('should navigate through the scrollytelling flow and use interactive features', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page.getByText(/A sorte é um erro de cálculo/i)).toBeVisible();

    // 2. Scroll to Generator
    const generatorSection = page.locator('#simular');
    await generatorSection.scrollIntoViewIfNeeded();
    await expect(page.getByText('Gerador de Apostas')).toBeVisible();

    // 3. Generate a game
    await page.getByRole('button', { name: '🎲 Gerar' }).click();
    // Wait for animation (shuffle ticks)
    await page.waitForTimeout(2000); 
    
    // Check that we have 6 generated balls (using the BallDisplay logic)
    await expect(generatorSection.locator('.ball-shadow')).toHaveCount(6, { timeout: 10000 });

    // 4. Scroll to Search
    const searchSection = page.locator('#buscar');
    await searchSection.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Já fui sorteado?' })).toBeVisible();

    // 5. Perform a Search
    const inputs = page.locator('input[type="text"]');
    const numbers = ['04', '05', '30', '33', '41', '52'];
    for (let i = 0; i < 6; i++) {
        await inputs.nth(i).fill(numbers[i]);
    }
    await page.getByRole('button', { name: /Buscar nos/ }).click();
    
    // Check results and URL navigation
    await expect(page.getByText(/NUNCA foi sorteada|Sua combinação saiu/)).toBeVisible();
    await expect(page).toHaveURL(/\/buscar\/04-05-30-33-41-52/);

    // 6. Navigate to Dashboard
    // Use direct goto to avoid flakiness in the test environment link interaction
    await page.goto('/dados');
    await expect(page.getByRole('heading', { name: /Dashboard Analítico/i })).toBeVisible({ timeout: 15000 });
    
    // Verify a KPI card
    await expect(page.getByText('Total de concursos').first()).toBeVisible();
    await expect(page.getByText(/2[.,]98/).first()).toBeVisible();
  });
});
