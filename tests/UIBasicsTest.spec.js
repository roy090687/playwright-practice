const { test, expect } = require('@playwright/test');

test('Browser context playwright test', async ({ browser }) => {
    const url = 'https://rahulshettyacademy.com/loginpagePractise/';
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const pwd = page.locator("[id='password']");
    const signInBtn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');

    await page.goto(url);
    console.log('1st Page Title:', await page.title());
    await userName.fill("rahulshetty");
    await pwd.fill("learning");
    await signInBtn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect username/');
    // Below line is not required because await userName.fill("rahulshettyacademy"); will replace any existing text in the input.
    //await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signInBtn.click();
    console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});

test('Page playwright test', async ({ page }) => {
    const url = 'https://google.com';
    await page.goto(url);
    const pageTitle = await page.title();
    console.log('2nd Page Title:', pageTitle);
    await expect(page).toHaveTitle('Google');
});

// Dropdown, radiobutton, link assertion and the assertions.
test('UI Controls test', async ({ page }) => {
    const url = 'https://rahulshettyacademy.com/loginpagePractise/';
    const dropdown = page.locator("select.form-control");
    const userRadio = page.locator('[value="user"]');
    const documentLink = page.locator("[href*='documents-request']");
    await page.goto(url);
    console.log('1st Page Title:', await page.title());
    await userRadio.click();
    //await page.locator(".radiotextsty").nth(1).click(); // another way of selecting user radio button
    await page.locator("#okayBtn").click();
    await dropdown.selectOption('consult');
    //await page.pause();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

// Window Handling
test('Window handle test', async ({ browser }) => {
    const url = 'https://rahulshettyacademy.com/loginpagePractise/';
    const context = await browser.newContext();
    const page = await context.newPage();
    const documentLink = page.locator("[href*='documents-request']");
    await page.goto(url);

    // Promise.all ensures both happen together — you don’t miss the timing
    const [newChildPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ]);
    await newChildPage.waitForLoadState(); // ensures the child page is fully loaded
    const text = await newChildPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await newChildPage.close(); // close after operation

     // Back to main page (using 'page' object)
    await page.locator("#username").fill(domain);

    const test2 = await page.locator("#username").inputValue(); // get the value from an edit box after updating.
    expect(domain).toBe(test2);
});