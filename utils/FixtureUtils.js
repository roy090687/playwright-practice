const base = require('@playwright/test');
const { request } = require('@playwright/test')
const { WebAPI } = require('./WebAPIUtils')

const loginPayload = { userEmail: "snehasishqa@gmail.com", userPassword: "5Million$" };
const orderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};
const CLIENT_URL = "https://rahulshettyacademy.com/client/";

exports.customtest = base.test.extend({

    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(CLIENT_URL);
        await page.locator('#userEmail').fill('snehasishqa@gmail.com');
        await page.locator('#userPassword').fill('5Million$');
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');
        await use(page)

        // Tear down
        console.log("Closing context")
        await context.close();
    },

    createOrder: async ({ }, use) => {
        const apiContext = await request.newContext();
        const apiUtils = new WebAPI(apiContext, loginPayload);
        const response = await apiUtils.createOrder(orderPayload);
        use(response)

        // Tear down
        console.log("Closing api context")
        await apiContext.dispose();
    },

    testDataOrder: {
        productName: 'ADIDAS ORIGINAL'
    }
})

exports.CLIENT_URL = CLIENT_URL