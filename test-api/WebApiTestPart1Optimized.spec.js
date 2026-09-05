const { test, expect, request } = require('@playwright/test')
const {WebAPI} = require('../utils/WebAPIUtils')

const zaraCoatProductId = "6960eac0c941646b7a8b3e68";
let response;

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
    const apiUtils = new WebAPI(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
   
})

test('Place the order test', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/client/';

    // API call for login (It skips login from UI)
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto(url);
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderID = await rows.nth(i).locator('th').textContent();
        if (response.orderId.includes(rowOrderID)) {
            await rows.nth(i).locator("button").first().click(); // Use chain locator process.
            break;
        }
    }
    // Order Summary page
    await expect(page.locator(".email-title")).toHaveText(" order summary ");
    const oderIdSummaryPage = await page.locator('.col-text').textContent();
    expect(response.orderId.includes(oderIdSummaryPage)).toBeTruthy();
});