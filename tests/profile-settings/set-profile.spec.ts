import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");

  await page.getByPlaceholder("admin@mail.com").fill("admin@mail.com");
  await page.getByPlaceholder("••••••••").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/dashboard/);
}

test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/settings");
  });

  test("save profile", async ({ page }) => {
    await page.getByPlaceholder("First Name").fill("Shubham");
    await page.getByRole("button", { name: "Save Profile" }).click();

    await expect(page.getByText("Profile saved")).toBeVisible();
  });

  test("persist profile", async ({ page }) => {
    await page.getByPlaceholder("First Name").fill("Shubham");
    await page.getByRole("button", { name: "Save Profile" }).click();

    await page.reload();
    await expect(page.getByPlaceholder("First Name")).toHaveValue("Shubham");
  });
});
