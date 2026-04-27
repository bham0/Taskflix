import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

test.describe("Image Gallery", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/images");
  });

  test("renders title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Image Gallery" }),
    ).toBeVisible();
  });

  test("renders search", async ({ page }) => {
    await expect(page.getByPlaceholder("Search images...")).toBeVisible();
  });
});
