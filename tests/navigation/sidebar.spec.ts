import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

test.describe("Sidebar Navigation", () => {
  test("navigation works", async ({ page }) => {
    await login(page);

    await page.locator("aside a[href='/settings']").click();
    await expect(page).toHaveURL(/settings/);

    await page.locator("aside a[href='/images']").click();
    await expect(page).toHaveURL(/images/);

    await page.locator("aside a[href='/dashboard']").click();
    await expect(page).toHaveURL(/dashboard/);
  });
});
