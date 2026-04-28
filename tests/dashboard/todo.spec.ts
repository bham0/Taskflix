import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByTestId("login-email").fill("admin@mail.com");
  await page.getByTestId("login-password").fill("123456");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
}

test.describe("Todo App", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit localStorage auth not supported",
  );

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("adds a new todo and shows it in the list", async ({ page }) => {
    await page.getByPlaceholder("Add new task").fill("Test todo");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Test todo")).toBeVisible();
  });

  test("adds todo via Enter key", async ({ page }) => {
    await page.getByPlaceholder("Add new task").fill("Enter key todo");
    await page.getByPlaceholder("Add new task").press("Enter");
    await expect(page.getByText("Enter key todo")).toBeVisible();
  });

  test("empty input does not add a todo", async ({ page }) => {
    const before = await page.locator('input[type="checkbox"]').count();
    await page.getByRole("button", { name: "Add" }).click();
    const after = await page.locator('input[type="checkbox"]').count();
    expect(after).toBe(before);
  });

  test("marks a todo as completed", async ({ page }) => {
    await page.getByPlaceholder("Add new task").fill("Complete me");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Complete me")).toBeVisible();
    await page.locator('input[type="checkbox"]').last().check();
    await expect(page.getByText("Complete me")).toHaveCSS(
      "text-decoration-line",
      "line-through",
    );
  });

  test("deletes a todo", async ({ page }) => {
    await page.getByPlaceholder("Add new task").fill("Delete me");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Delete me")).toBeVisible();

    const todoText = page.getByText("Delete me").last();
    const todoCard = todoText
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl')]")
      .last();

    await todoCard.locator("button").last().click();

    await expect(page.getByText("Delete me")).not.toBeVisible();
  });

  test.describe("Filter tabs", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByPlaceholder("Add new task").fill("Active task");
      await page.getByRole("button", { name: "Add" }).click();

      await page.getByPlaceholder("Add new task").fill("Done task");
      await page.getByRole("button", { name: "Add" }).click();

      await page.locator('input[type="checkbox"]').last().check();
    });

    test("Active filter shows only incomplete todos", async ({ page }) => {
      await page.getByRole("button", { name: "Active" }).click();
      await expect(page.getByText("Active task")).toBeVisible();
      await expect(page.getByText("Done task")).not.toBeVisible();
    });

    test("Completed filter shows only done todos", async ({ page }) => {
      await page.getByRole("button", { name: "Completed" }).click();
      await expect(page.getByText("Done task")).toBeVisible();
      await expect(page.getByText("Active task")).not.toBeVisible();
    });

    test("All filter shows every todo", async ({ page }) => {
      await page.getByRole("button", { name: "Completed" }).click();
      await page.getByRole("button", { name: "All" }).click();
      await expect(page.getByText("Active task")).toBeVisible();
      await expect(page.getByText("Done task")).toBeVisible();
    });

    test("remaining tasks count decrements when todo is completed", async ({
      page,
    }) => {
      const countText = page
        .locator("p")
        .filter({ hasText: "Remaining tasks" });

      const before = await countText.textContent();

      await page.locator('input[type="checkbox"]').first().check();

      const after = await countText.textContent();

      const beforeNum = parseInt(before?.match(/\d+/)?.[0] ?? "0");
      const afterNum = parseInt(after?.match(/\d+/)?.[0] ?? "0");

      expect(afterNum).toBe(beforeNum - 1);
    });
  });
});
