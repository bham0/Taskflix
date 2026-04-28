import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Login", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit localStorage auth not supported",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await page.getByTestId("login-email").fill("admin@mail.com");
    await page.getByTestId("login-password").fill("123456");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
  });

  test("wrong password shows error toast", async ({ page }) => {
    await page.getByTestId("login-email").fill("admin@mail.com");
    await page.getByTestId("login-password").fill("wrongpass");
    await page.getByTestId("login-submit").click();
    await expect(page.getByText("Incorrect password")).toBeVisible({
      timeout: 8000,
    });
  });

  test("unknown email shows error toast", async ({ page }) => {
    await page.getByTestId("login-email").fill("ghost@mail.com");
    await page.getByTestId("login-password").fill("123456");
    await page.getByTestId("login-submit").click();
    await expect(
      page.getByText("No account found with this email"),
    ).toBeVisible({ timeout: 8000 });
  });

  test("empty email shows validation toast", async ({ page }) => {
    await page.getByTestId("login-submit").click();
    await expect(page.getByText("Please enter your email")).toBeVisible({
      timeout: 8000,
    });
  });

  test("empty password shows validation toast", async ({ page }) => {
    await page.getByTestId("login-email").fill("admin@mail.com");
    await page.getByTestId("login-submit").click();
    await expect(page.getByText("Please enter your password")).toBeVisible({
      timeout: 8000,
    });
  });

  test("Enter key submits login form", async ({ page }) => {
    await page.getByTestId("login-email").fill("admin@mail.com");
    await page.getByTestId("login-password").fill("123456");
    await page.getByTestId("login-password").press("Enter");
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
  });

  test("second demo account logs in correctly", async ({ page }) => {
    await page.getByTestId("login-email").fill("jane@mail.com");
    await page.getByTestId("login-password").fill("jane123");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
  });
});

test.describe("Sign Up", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit localStorage auth not supported",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByTestId("tab-signup").click();
    await expect(page.getByTestId("signup-name")).toBeVisible();
  });

  test("successful signup redirects to dashboard", async ({ page }) => {
    await page.getByTestId("signup-name").fill("New User");
    await page.getByTestId("signup-email").fill(`new+${Date.now()}@mail.com`);
    await page.getByTestId("signup-password").fill("newpass123");
    await page.getByTestId("signup-submit").click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
  });

  test("duplicate email shows already-signed-up toast", async ({ page }) => {
    await page.getByTestId("signup-name").fill("Shubham Again");
    await page.getByTestId("signup-email").fill("admin@mail.com");
    await page.getByTestId("signup-password").fill("anypassword");
    await page.getByTestId("signup-submit").click();
    await expect(page.getByText("Already signed up.")).toBeVisible({
      timeout: 8000,
    });
  });

  test("short password shows validation toast", async ({ page }) => {
    await page.getByTestId("signup-name").fill("Test User");
    await page.getByTestId("signup-email").fill("test@mail.com");
    await page.getByTestId("signup-password").fill("abc");
    await page.getByTestId("signup-submit").click();
    await expect(
      page.getByText("Password must be at least 6 characters"),
    ).toBeVisible({ timeout: 8000 });
  });

  test("empty name shows validation toast", async ({ page }) => {
    await page.getByTestId("signup-submit").click();
    await expect(page.getByText("Please enter your name")).toBeVisible({
      timeout: 8000,
    });
  });
});
