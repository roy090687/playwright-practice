const { test, expect } = require('@playwright/test');

test('Login test for client app', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/client/';
    await page.goto(url);
    await page.locator('#userEmail').fill('anshika@gmail.com');
    await page.locator('#userPassword').type('Iamking@000');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    const allTitles = await page.locator('.card-body b').allTextContents();
    console.log(allTitles)
});

test('Login test for client app - 2nd way', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/client/';
    await page.goto(url);
    await page.locator('#userEmail').fill('anshika@gmail.com');
    await page.locator('#userPassword').type('Iamking@000');
    await page.locator("[value='Login']").click();
    // Sometimes 'networkidle' doesn't work as expected. So another solution to return all the test contents.
    // await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();
    const allTitles = await page.locator('.card-body b').allTextContents();
    console.log(allTitles)
});

test('Find product dynamically in client app', async ({ page }) => {
    const productName = "ZARA COAT 3";
    const products = page.locator(".card-body");
    const url = 'https://rahulshettyacademy.com/client/';
    const email = 'snehasishqa@gmail.com';
    await page.goto(url);
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').type('5Million$');
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
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
