import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

test.describe("Theme Toggle", () => {
  test("toggles theme", async ({ page }) => {
    await login(page);

    const html = page.locator("html");

    await page.locator("header button").first().click();
    await expect(html).toHaveClass(/dark/);

    await page.locator("header button").first().click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
