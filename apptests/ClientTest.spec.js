const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager')

test('end to end clinet app validation', async ({ page }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const cartPage = poManager.getcartPage();
    const orderReviewPage = poManager.getOrdersReviewPage();
    const orderHistoryPage = poManager.getOrdersHistoryPage();

    // Variables
    const productName = "ZARA COAT 3";
    const username = 'snehasishqa@gmail.com';
    const password = '5Million$';

    await loginPage.goTo();
    await loginPage.login(username, password);
    await dashboardPage.searchForProduct(productName);
    await dashboardPage.navigateToCart();

    await cartPage.verifyProductIsDisplayed(productName);
    await cartPage.checkout();

    await orderReviewPage.searchCountryAndSelect("Ind", "India");
    await orderReviewPage.VerifyEmailId(username);
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
