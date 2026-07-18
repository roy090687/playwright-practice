const { test, expect } = require('@playwright/test');

/**
 * How to save session storage using playwright and inject into new browser context. 
 * This will help if your application demands a bit complicated login which might need many storage requirements.
 */

const url = 'https://rahulshettyacademy.com/client/';
const email = "anshika@gmail.com"
const password = "Iamking@000"
let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').type(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' })
    webContext = await browser.newContext({ storageState: 'state.json' });
})


test('verify all the titles', async () => {
    const page = await webContext.newPage();
    await page.goto(url);
    const allTitles = await page.locator('.card-body b').allTextContents();
    console.log(allTitles)
});

test('Find product dynamically in client app', async () => {
    const page = await webContext.newPage();
    const productName = "ZARA COAT 3";
    const products = page.locator(".card-body");
    await page.goto(url);
    const allTitles = await page.locator('.card-body b').allTextContents();
    console.log(allTitles)

    const count = await products.count();
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            // add to cart
            await products.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator(`article:has-text("${productName}")`).isVisible();
    expect(bool).toBeTruthy;

    // Checkout operations
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("Ind");
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text.trim() === "India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(' Thankyou for the order. ');
    const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log("Order ID:", orderID);

    // Dynamically find the order from order history page using orderID. From Order tab at top.
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();
    const rows = page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderID = await rows.nth(i).locator('th').textContent();
        if (orderID.includes(rowOrderID)) {
            await rows.nth(i).locator("button").first().click(); // Use chain locator process.
            break;
        }
    }
    // Order Summary page
    await expect(page.locator(".email-title")).toHaveText(" order summary ");
    const oderIdViewPage = await page.locator('.col-text').textContent();
    expect(orderID.includes(oderIdViewPage)).toBeTruthy();
});
