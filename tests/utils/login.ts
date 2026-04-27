import { Page, expect } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}
