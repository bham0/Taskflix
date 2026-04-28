import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByTestId("login-email").fill("admin@mail.com");
  await page.getByTestId("login-password").fill("123456");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
}

test.describe("Profile / Settings", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/settings`);
  });

  test("save profile shows success toast", async ({ page }) => {
    await page.getByPlaceholder("First Name").fill("Shubham");
    await page.getByRole("button", { name: "Save Profile" }).click();
    await expect(page.getByText("Profile saved")).toBeVisible({
      timeout: 8000,
    });
  });

  test("all fields accept input and save", async ({ page }) => {
    await page.getByPlaceholder("First Name").fill("Shubham");
    await page.getByPlaceholder("Last Name").fill("Doe");
    await page.getByPlaceholder("Email Address").fill("shubham@mail.com");
    await page.getByPlaceholder("Address", { exact: true }).fill("123 Main St");
    await page.getByPlaceholder("Pincode").fill("411001");
    await page.getByRole("button", { name: "Save Profile" }).click();
    await expect(page.getByText("Profile saved")).toBeVisible({
      timeout: 8000,
    });
  });

  test("saved values reflect in fields after save", async ({ page }) => {
    await page.getByPlaceholder("First Name").fill("Shubham");
    await page.getByPlaceholder("Last Name").fill("Doe");
    await page.getByRole("button", { name: "Save Profile" }).click();
    await expect(page.getByText("Profile saved")).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByPlaceholder("First Name")).toHaveValue("Shubham");
    await expect(page.getByPlaceholder("Last Name")).toHaveValue("Doe");
  });
});
