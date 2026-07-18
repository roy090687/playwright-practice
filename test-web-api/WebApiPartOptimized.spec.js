const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('./utils/ApiUtils');

const zaraCoatProductId = "6960eac0c941646b7a8b3e68";
let token;
let orderId;

const loginAPI = "https://rahulshettyacademy.com/api/ecom/auth/login";
const orderAPI = "https://rahulshettyacademy.com/api/ecom/order/create-order";
const loginPayload = { userEmail: "snehasishqa@gmail.com", userPassword: "5Million$" };
const orderPayload = {
    orders: [
        {
            country: "Cuba",
            productOrderedId: zaraCoatProductId
        }
    ]
};

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    const loginResponse = await apiUtils.getLoginResponse(loginAPI);
    expect(loginResponse.ok()).toBeTruthy();
    token = await apiUtils.getToken(loginAPI);

    const orderResponse = await apiUtils.getCreateOrderResponse(orderAPI, orderPayload, token);
    expect(orderResponse.status()).toBe(201);
    orderId = await apiUtils.createOrder(orderAPI, orderPayload, token);
});

test('Place order validation', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/client/';

    // API call for login (It skips login from UI)
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto(url);
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderID = await rows.nth(i).locator('th').textContent();
        if (orderId.includes(rowOrderID)) {
            await rows.nth(i).locator("button").first().click(); // Use chain locator process.
            break;
        }
    }
    // Order Summary page
    await expect(page.locator(".email-title")).toHaveText(" order summary ");
    const oderIdViewPage = await page.locator('.col-text').textContent();
    expect(orderId.includes(oderIdViewPage)).toBeTruthy();
});