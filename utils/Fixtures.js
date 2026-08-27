const base = require('@playwright/test');
const { APIUtils } = require('./ApiUtils');
const loginPayload = { userEmail: "snehasishqa@gmail.com", userPassword: "5Million$" };
const orderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};

exports.customtest = base.test.extend({

    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client/");
        await page.locator('#userEmail').fill('snehasishqa@gmail.com');
        await page.locator('#userPassword').fill('5Million$');
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');

        await use(page)
    },

    createOrder: async ({ }, use) => {
        const apiContext = await request.newContext();
        const apiUtils = new APIUtils(apiContext, loginPayload);
        const loginResponse = await apiUtils.getLoginResponse(loginAPI);
        expect(loginResponse.ok()).toBeTruthy();
        token = await apiUtils.getToken(loginAPI);

        const orderResponse = await apiUtils.getCreateOrderResponse(orderAPI, orderPayload, token);
        expect(orderResponse.status()).toBe(201);
        const orderId = await apiUtils.createOrder(orderAPI, orderPayload, token);

        await use(orderId);

    }
})