import { test, expect } from '@playwright/test';

test.describe('NutriLink End-to-End Application Audit', () => {

  test('1. Landing and Sign In Screen Check', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*signin/);

    // Verify Sign In elements
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Verify Google Sign In button exists
    const googleBtn = page.getByRole('button', { name: /Sign in with Google|Continue with Google/i });
    await expect(googleBtn).toBeVisible();
  });

  test('2. Google Authentication & Navigation Flow', async ({ page }) => {
    await page.goto('/signin');

    const googleBtn = page.getByRole('button', { name: /Sign in with Google|Continue with Google/i });
    await googleBtn.click();

    // Verify redirect to capture page after Google Auth
    await page.waitForURL('/capture', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(/AI Vision|Food/i);
  });

  test('3. Sync Page & Google Fit Integration Check', async ({ page }) => {
    await page.goto('/sync');

    // Verify Integrations header
    await expect(page.locator('h1')).toContainText(/Connect Devices/i);

    // Verify Google Fit card and Connect button
    const googleFitButton = page.getByRole('button', { name: /Connect Google Fit/i });
    await expect(googleFitButton).toBeVisible();

    // Click Connect Google Fit
    await googleFitButton.click();
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 5000 });
  });

  test('4. Nutrients & History Screen Audit', async ({ page }) => {
    await page.goto('/nutrients');
    await expect(page.locator('h1')).toContainText(/Nutrients/i);

    await page.goto('/history');
    await expect(page.locator('body')).toBeVisible();
  });
});
