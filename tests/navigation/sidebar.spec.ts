import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByTestId("login-email").fill("admin@mail.com");
  await page.getByTestId("login-password").fill("123456");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
}

test.describe("Sidebar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("sidebar is visible on desktop", async ({ page }) => {
    await expect(page.locator("aside")).toBeVisible();
  });

  test("navigates to Settings", async ({ page }) => {
    await page.locator("aside a[href='/settings']").click();
    await expect(page).toHaveURL(/settings/, { timeout: 8000 });
  });

  test("navigates to Gallery", async ({ page }) => {
    await page.locator("aside a[href='/images']").click();
    await expect(page).toHaveURL(/images/, { timeout: 8000 });
  });

  test("navigates back to Dashboard", async ({ page }) => {
    await page.locator("aside a[href='/settings']").click();
    await expect(page).toHaveURL(/settings/, { timeout: 8000 });
    await page.locator("aside a[href='/dashboard']").click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
  });

  test("mobile menu opens and shows nav links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .first()
      .click();
    await expect(page.locator("aside a[href='/dashboard'] span")).toBeVisible();
    await expect(page.locator("aside a[href='/settings'] span")).toBeVisible();
    await expect(page.locator("aside a[href='/images'] span")).toBeVisible();
  });

  test("mobile menu closes on overlay click", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .first()
      .click();
    await expect(page.locator("aside a[href='/dashboard'] span")).toBeVisible();
    await page.locator(".fixed.inset-0").click({ force: true });
    await expect(
      page.locator("aside a[href='/dashboard'] span"),
    ).not.toBeVisible();
  });
});
