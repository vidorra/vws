import { test, expect } from '@playwright/test';

test.describe('Site context (vaatwasstrips)', () => {
  test.use({
    extraHTTPHeaders: { 'Host': 'vaatwasstripsvergelijker.nl' },
  });

  test('homepage shows vaatwasstrips branding', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('vaatwasstrips');
  });

  test('navigation shows correct brand name', async ({ page }) => {
    await page.goto('/');
    const navText = await page.locator('nav').textContent();
    expect(navText).toContain('Vaatwasstrips');
  });

  test('sitemap returns correct domain', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const body = await response?.text();
    expect(body).toContain('vaatwasstripsvergelijker.nl');
  });
});

test.describe('Site context (wasstrips)', () => {
  test.use({
    extraHTTPHeaders: { 'Host': 'wasstripsvergelijker.nl' },
  });

  test('homepage shows wasstrips branding', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.toLowerCase()).toContain('wasstrips');
    expect(title.toLowerCase()).not.toContain('vaatwasstrips');
  });
});

test.describe('Admin login flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/data-beheer/login');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/data-beheer/login');

    await page.fill('input[type="email"], input[name="email"]', 'wrong@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error or stay on login page
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Public pages', () => {
  test('gids page loads', async ({ page }) => {
    await page.goto('/gids');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('troubleshooting page loads', async ({ page }) => {
    await page.goto('/gids/troubleshooting');
    await expect(page.locator('h1')).toContainText('Problemen Oplossen');
  });

  test('productfinder page loads', async ({ page }) => {
    await page.goto('/productfinder');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacybeleid');
    await expect(page.locator('h1')).toBeVisible();
  });
});
