# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> NutriLink End-to-End Application Audit >> 1. Landing and Sign In Screen Check
- Location: e2e\app.spec.ts:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('NutriLink End-to-End Application Audit', () => {
  4  | 
  5  |   test('1. Landing and Sign In Screen Check', async ({ page }) => {
> 6  |     await page.goto('/');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  |     await expect(page).toHaveURL(/.*signin/);
  8  | 
  9  |     // Verify Sign In elements
  10 |     const heading = page.locator('h1').first();
  11 |     await expect(heading).toBeVisible();
  12 | 
  13 |     // Verify Google Sign In button exists
  14 |     const googleBtn = page.getByRole('button', { name: /Sign in with Google|Continue with Google/i });
  15 |     await expect(googleBtn).toBeVisible();
  16 |   });
  17 | 
  18 |   test('2. Google Authentication & Navigation Flow', async ({ page }) => {
  19 |     await page.goto('/signin');
  20 | 
  21 |     const googleBtn = page.getByRole('button', { name: /Sign in with Google|Continue with Google/i });
  22 |     await googleBtn.click();
  23 | 
  24 |     // Verify redirect to capture page after Google Auth
  25 |     await page.waitForURL('/capture', { timeout: 10000 });
  26 |     await expect(page.locator('h1')).toContainText(/AI Vision|Food/i);
  27 |   });
  28 | 
  29 |   test('3. Sync Page & Google Fit Integration Check', async ({ page }) => {
  30 |     await page.goto('/sync');
  31 | 
  32 |     // Verify Integrations header
  33 |     await expect(page.locator('h1')).toContainText(/Connect Devices/i);
  34 | 
  35 |     // Verify Google Fit card and Connect button
  36 |     const googleFitButton = page.getByRole('button', { name: /Connect Google Fit/i });
  37 |     await expect(googleFitButton).toBeVisible();
  38 | 
  39 |     // Click Connect Google Fit
  40 |     await googleFitButton.click();
  41 |     await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 5000 });
  42 |   });
  43 | 
  44 |   test('4. Nutrients & History Screen Audit', async ({ page }) => {
  45 |     await page.goto('/nutrients');
  46 |     await expect(page.locator('h1')).toContainText(/Nutrients/i);
  47 | 
  48 |     await page.goto('/history');
  49 |     await expect(page.locator('body')).toBeVisible();
  50 |   });
  51 | });
  52 | 
```