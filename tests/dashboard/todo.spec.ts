import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

test("todo flow", async ({ page }) => {
  await login(page);

  await page.getByPlaceholder("Add todo").fill("Test todo");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText("Test todo")).toBeVisible();
});
