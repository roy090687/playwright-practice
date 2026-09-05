const { test, expect } = require('@playwright/test');

test("Dynamic table test for rahulshetty application page", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");

    const table = page.locator('[role="table"]');
    await expect(table).toBeVisible();

    const fruitColumn = page.getByRole('columnheader', { name: /fruit name/i });
    const priceColumn = page.getByRole('columnheader', { name: /price/i });

    await expect(fruitColumn).toBeVisible();
    await expect(priceColumn).toBeVisible();

    const bananaRow = page.locator('[role="row"]').filter({ hasText: 'Banana' }).first();
    await expect(bananaRow).toBeVisible();

    await expect(bananaRow).toContainText('Banana');
    await expect(bananaRow).toContainText('69');

    const bananaPrice = bananaRow.locator('[role="cell"]').nth(3);
    await expect(bananaPrice).toHaveText('69');
});