# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> NutriLink End-to-End Application Audit >> 3. Sync Page & Google Fit Integration Check
- Location: e2e\app.spec.ts:29:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected pattern: /Connect Devices/i
Error: strict mode violation: locator('h1') resolved to 2 elements:
    1) <h1 class="text-lg font-semibold text-foreground ml-2">Integrations</h1> aka getByRole('heading', { name: 'Integrations' })
    2) <h1 class="text-4xl font-bold text-foreground mb-2">…</h1> aka getByRole('heading', { name: 'Connect Devices' })

Call log:
  - Expect "toContainText" locator('h1') with timeout 5000ms
  - waiting for locator('h1')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e7] [cursor=pointer]:
          - text: NutriLink
          - generic [ref=e8]: Premium AI
        - heading "Integrations" [level=1] [ref=e9]
      - navigation [ref=e10]:
        - button "DASHBOARD" [ref=e11] [cursor=pointer]
        - button "HISTORY" [ref=e12] [cursor=pointer]
        - button "STATISTICS" [ref=e13] [cursor=pointer]
      - generic [ref=e14]:
        - button [ref=e16] [cursor=pointer]
        - button "UA User" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: UA
          - generic [ref=e25]: User
    - main [ref=e26]:
      - generic [ref=e27]:
        - heading "Connect Devices" [level=1] [ref=e28]
        - paragraph [ref=e29]: Centralize your biometric data for high-precision nutrition analysis and automated health insights.
      - generic [ref=e30]:
        - generic [ref=e31]:
          - generic [ref=e32]: DISCONNECTED
          - heading "Google Fit" [level=3] [ref=e38]
          - paragraph [ref=e39]: Seamlessly import heart rate, resting metabolic rate, and daily activity logs from your Google ecosystem.
          - button "Connect Google Fit" [ref=e40] [cursor=pointer]
        - generic [ref=e41]:
          - generic [ref=e42]: COMING SOON
          - heading "Fitbit" [level=3] [ref=e53]
          - paragraph [ref=e54]: Track specialized metrics including sleep stages, flooring levels, and active zone minutes.
          - button "Notify Me" [ref=e55] [cursor=pointer]
        - generic [ref=e56]:
          - generic [ref=e57]: COMING SOON
          - heading "Apple Health" [level=3] [ref=e63]
          - paragraph [ref=e64]: Premium integration including Apple Watch VO2 Max data and comprehensive dietary macronutrients.
          - button "Notify Me" [ref=e65] [cursor=pointer]
      - button "Sync Nutrition Data" [disabled] [ref=e67]
      - generic [ref=e73]:
        - generic [ref=e74]: OAUTH 2.0 ENCRYPTED
        - generic [ref=e78]: HIPAA COMPLIANT
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('NutriLink End-to-End Application Audit', () => {
  4  | 
  5  |   test('1. Landing and Sign In Screen Check', async ({ page }) => {
  6  |     await page.goto('/');
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
> 33 |     await expect(page.locator('h1')).toContainText(/Connect Devices/i);
     |                                      ^ Error: expect(locator).toContainText(expected) failed
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