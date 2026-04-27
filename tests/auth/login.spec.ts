import { test, expect } from "@playwright/test";

test("login works", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
});
