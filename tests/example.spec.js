// @ts-check
const { test, expect } = require("@playwright/test");

test("opens QAuto landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/qauto\.forstudy\.space/);
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
});
