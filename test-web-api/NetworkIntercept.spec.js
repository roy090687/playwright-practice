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
const fakeOrderPayload = { data: [], message: "No Orders" }

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

})

test('Netowrok intercept validation', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/client/';

    // API call for login (It skips login from UI)
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto(url);
    // intercepting response - API response -> {playwright fakeresponse} -> browser -> render data in UI
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            /**
             * First getting the response using page.request.fetch(route.request())
             * Then using fulfill(), passing the response to the browser.
             * Inside fulfill(), pass the response and the response body. 
             * This body is basically the payload of fake response and now that will be passed to browser.
             */
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakeOrderPayload);
            route.fulfill({
                response,
                body
            });
        }
    )
    await page.locator("button[routerlink*='myorders']").click();
    // wait until the fake response is processed
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    const actual = await page.locator(".mt-4").textContent();
    console.log(actual);
    expect(actual).toContain("You have No Orders to show at this time.");
});