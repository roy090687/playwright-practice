const { test, expect } = require('@playwright/test')

test("browser forward-backward validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("http://google.com");
    await page.goBack();
    await expect(page).toHaveURL("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goForward();
    const currentURL = page.url();
    console.log("Retrieved current url:", currentURL);
    expect(currentURL).toContain('google.com');
    expect(currentURL.startsWith("https://www.google.com")).toBeTruthy(); // another way of checking.
})

test("visible and invisible element validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();
})

/**
 * page.on('dialog', ...) registers an event listener for dialog events.
 * Whenever the page triggers a JavaScript dialog (alert, confirm, prompt),
 * this listener will automatically run.
 *
 * In this example, we call dialog.accept() inside the listener, so any
 * dialog that appears during the test will be accepted immediately.
 *
 * Important notes:
 * - You can set this listener anywhere in your test; once registered,
 *   it remains active for the lifetime of the page.
 * - The listener is asynchronous: Playwright will pause the test until
 *   the dialog is handled.
 * - You can also use dialog.dismiss() or dialog.defaultValue for prompts
 *   depending on the scenario.
 */
test("popup validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#confirmbtn').click();
})

test("popup validations based on dialog type", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    page.on('dialog', async dialog => {
        console.log("Dialog type:", dialog.type());
        console.log("Dialog message:", dialog.message());
        if (dialog.type() === 'confirm') {
            // Try dismissing instead of accepting
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
    });
    await page.locator('#confirmbtn').click();
})

/**
 * Registers a one‑time listener for dialog events using page.once.
 *
 * Behavior:
 * - The listener applies only to the next dialog event after registration.
 * - Once that dialog is handled, the listener is automatically removed.
 * - Maintains order: listeners are consumed sequentially in the order they are declared.
 *
 * Usage notes:
 * - If you register multiple page.once listeners in sequence, they will be consumed one by one:
 *   1. First popup → handled by the first listener (then removed).
 *   2. Second popup → handled by the second listener (then removed).
 *   3. Third popup → handled by the third listener (then removed).
 *
 * This makes page.once ideal for scenarios where different dialogs
 * in the same test case require different actions (e.g., accept first, dismiss second).
 */
test("popup validations accept then dismiss - multiple popups handled in a single TC", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // First popup → accept
    page.once('dialog', async dialog => {
        console.log("First popup:", dialog.message());
        await dialog.accept();
    });
    await page.locator('#confirmbtn').click();

    // Second popup → dismiss
    page.once('dialog', async dialog => {
        console.log("Second popup:", dialog.message());
        await dialog.dismiss();
    });
    await page.locator('#confirmbtn').click();
});

test("mouse-hover validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator('#mousehover').hover();
    await page.getByRole('link', { name: 'Top' }).click();
})

// --------- Frame handle ---------

test("frame handling", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click(); // 2 elements, we take only the visible element in UI.
    const textCheck = await framePage.locator(".text h2").textContent();
    console.log("Expected text:", textCheck.split(" ")[1]);
})

// Screenshots
test("Screenshot testing", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#displayed-text').screenshot({ path: 'partial.png' });
    await page.locator('#hide-textbox').click();
    await page.screenshot({ path: 'screenshot.png' });
    await expect(page.locator('#displayed-text')).toBeHidden();
})

// Visual testing
test("Visual comparison testing", async ({ page }) => {

})