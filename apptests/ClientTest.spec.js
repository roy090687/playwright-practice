const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager')
// JSON -> String -> JS Object
const dataset = JSON.parse(JSON.stringify(require('../resources/placeholderTestData.json')));

/**
 * Test data has been retrieved from an external data source, a json file.
 * Parameterization with dataset.
 */
for (const data of dataset) {
    test(`end to end clinet app validation for ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashBoardPage();
        const cartPage = poManager.getcartPage();
        const orderReviewPage = poManager.getOrdersReviewPage();
        const orderHistoryPage = poManager.getOrdersHistoryPage();

        await loginPage.goTo();
        await loginPage.login(data.username, data.password);
        await dashboardPage.searchForProduct(data.productName);
        await dashboardPage.navigateToCart();

        await cartPage.verifyProductIsDisplayed(data.productName);
        await cartPage.checkout();

        await orderReviewPage.searchCountryAndSelect("Ind", "India");
        await orderReviewPage.VerifyEmailId(data.username);
        const orderId = await orderReviewPage.SubmitAndGetOrderId();
        console.log("Order ID:", orderId);

        // Dynamically find the order from order history page using orderID. From Order tab at top.
        await dashboardPage.navigateToOrders();
        await orderHistoryPage.searchOrderAndSelect(orderId);
        const summaryLocator = orderHistoryPage.getOrderSummaryLocator();
        // Order Summary page
        await expect(summaryLocator).toHaveText(" order summary ");
        const oderIdViewPage = await orderHistoryPage.getOrderId();
        expect(orderId.includes(oderIdViewPage)).toBeTruthy();
    });
}
