import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Optimist|optimist/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("products page loads", async ({ page }) => {
    await page.goto("/products/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
  });

  test("cart page loads", async ({ page }) => {
    await page.goto("/cart/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in|login/i })).toBeVisible({ timeout: 10000 });
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact-us/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("button", { name: /send message|submit/i })).toBeVisible({ timeout: 10000 });
  });
});
