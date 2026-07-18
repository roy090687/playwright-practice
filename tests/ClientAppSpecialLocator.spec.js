const { test, expect } = require('@playwright/test');

test('E2E validation for client app', async ({ page }) => {
    const productName = "ZARA COAT 3";
    const products = page.locator(".card-body");
    const url = 'https://rahulshettyacademy.com/client/';
    const email = 'snehasishqa@gmail.com';
    await page.goto(url);
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your passsword').type('5Million$');
    await page.getByRole("button", { name: 'Login' }).click();
    await page.locator('.card-body b').first().waitFor();
    const allTitles = await page.locator('.card-body b').allTextContents();
    await page.locator('.card-body').filter({ hasText: `${productName}` })
        .getByRole("Button", { name: ' Add To Cart' }).click();

    await page.getByRole('listitem').getByRole('button', {name: 'Cart'}).click();
    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();
    await page.getByRole('button', {name: 'Checkout'}).click();
    await page.getByPlaceholder('Select Country').pressSequentially("Ind");
    await page.getByRole('Button', {name: 'India'}).nth(1).click();


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
