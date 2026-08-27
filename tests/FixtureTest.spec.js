const { expect } = require('@playwright/test');
const { customtest } = require("../utils/Fixtures.js")

customtest("Fixtures test", async ({ authenticatedPage, createOrder }) => {
    const url = "https://rahulshettyacademy.com/client/";
    await authenticatedPage.goto(url);
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator('tbody').waitFor();
    await expect(authenticatedPage.getByText(createOrder)).toBeVisible();
})