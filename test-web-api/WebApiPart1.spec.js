const { test, expect, request } = require('@playwright/test')

const zaraCoatProductId = "6960eac0c941646b7a8b3e68";
let token;
let orderId;

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
    // Login API
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
        data: loginPayload
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log("Token:", token);

    // Order API
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }

    })
    expect(orderResponse.status()).toBe(201);
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson)
    orderId = orderResponseJson.orders[0];
})

test('Client App login and validation', async ({ page }) => {
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