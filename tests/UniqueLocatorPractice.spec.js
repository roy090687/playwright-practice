const { test, expect } = require('@playwright/test');

test('Playwright special locators', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption('Female');
    await page.getByPlaceholder("Password").fill('abc123');
    //await page.getByRole('textbox', { name: 'Password' }).fill('abc123'); ==> using --debug, fetch the locator at run time for testing.
    await page.getByRole("button", { name: 'Submit' }).click();
    await page.getByTestId("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link", { name: "Shop" }).click();
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button").click();
});

