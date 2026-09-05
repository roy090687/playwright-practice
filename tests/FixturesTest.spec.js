const { test, expect, request } = require('@playwright/test')
const { customtest, CLIENT_URL } = require('../utils/FixtureUtils');


customtest("Fixture demo test", async ({ authenticatedPage, createOrder, testDataOrder }) => {
    authenticatedPage.goto(CLIENT_URL);
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator('tbody').waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
    console.log(testDataOrder.productName)
})