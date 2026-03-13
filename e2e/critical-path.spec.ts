import { test, expect } from "@playwright/test";

test.describe("Critical path", () => {
  test("navigation has cart and main links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("link", { name: /cart|bag|shopping/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("products page has add to cart or buy CTA when product loads", async ({ page }) => {
    await page.goto("/products/");
    await expect(page.locator("body")).toBeVisible();
    const addToCartOrBuy = page.getByRole("button", { name: /add to cart|buy now/i }).first();
    const productUnavailable = page.getByText("Product unavailable");
    await expect(addToCartOrBuy.or(productUnavailable)).toBeVisible({ timeout: 20000 });
  });

  test("cart page shows empty state or checkout when no items", async ({ page }) => {
    await page.goto("/cart/");
    await expect(page.locator("body")).toBeVisible();
    const emptyOrCheckout = page.getByText(/your cart is empty|proceed to checkout|cart is empty/i).first();
    await expect(emptyOrCheckout).toBeVisible({ timeout: 10000 });
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/login/");
    await expect(page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i))).toBeVisible({ timeout: 5000 });
  });
});
