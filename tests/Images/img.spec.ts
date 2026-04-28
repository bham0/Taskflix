import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByTestId("login-email").fill("admin@mail.com");
  await page.getByTestId("login-password").fill("123456");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
}

test.describe("Image Gallery", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/images`);
  });

  test("renders title and search", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Image Gallery" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Search images...")).toBeVisible();
  });

  test("search filters images", async ({ page }) => {
    await page.waitForSelector("[alt]", { timeout: 8000 });
    await page.getByPlaceholder("Search images...").fill("Mountain");
    await expect(page.getByText(/mountain/i).first()).toBeVisible();
  });

  test("category filter works", async ({ page }) => {
    await page.waitForSelector("[alt]", { timeout: 8000 });
    await page.locator("select").selectOption("Nature");
    await expect(page.locator("select")).toHaveValue("Nature");
    await expect(page.locator(".grid > div").first()).toBeVisible();
  });

  test("pagination next and prev work", async ({ page }) => {
    await page.waitForSelector("[alt]", { timeout: 8000 });
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByText(/Showing 13/)).toBeVisible();
    await page.getByRole("button", { name: "Prev", exact: true }).click();
    await expect(page.getByText(/Showing 1/)).toBeVisible();
  });

  test("no results message on unmatched search", async ({ page }) => {
    await page.getByPlaceholder("Search images...").fill("xyznotexist999");
    await expect(page.getByText("No images found.")).toBeVisible();
  });
});
