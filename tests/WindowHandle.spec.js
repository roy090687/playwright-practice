const { test, expect } = require('@playwright/test');
// import { ChildProcess } from 'node:child_process';

test('test for new tab', async ({ page, context }) => {

    let newPage;

    await page.goto("https://www.tutorialspoint.com/selenium/practice/browser-windows.php?utm_source=copilot.com");
    [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('button:has-text("New Tab")').click(),
    ])
    await newPage.waitForLoadState();
    const newtabText = await newPage.locator("h1.mb-3").innerText();
    expect(newtabText).toBe("New Tab");
    await newPage.close();

    [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('button:has-text("New Window")').nth(0).click()
    ])
    await newPage.waitForLoadState();
    const newWindowText = await newPage.locator("h1.mb-3").innerText();
    expect(newWindowText).toBe("New Window");
    await newPage.close();
});

test('test for new tab - 2nd way', async ({ page, context }) => {
    await page.goto("https://www.tutorialspoint.com/selenium/practice/browser-windows.php?utm_source=copilot.com");

    const links = [
        page.locator('button:has-text("New Tab")'),
        page.locator('button:has-text("New Window")').nth(0),
    ];

    const childPages = [];

    for (const link of links) {
        const [childPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);
        await childPage.waitForLoadState();
        childPages.push(childPage);
    }

    const n = childPages.length;
    for (let i = 0; i < n; i++) {
        const newPage = childPages[i];

        if (i === 0) {
            const newtabText = await newPage.locator("h1.mb-3").innerText();
            expect(newtabText).toBe("New Tab");
        }
        else if (i === 1) {
            const newWindowText1 = await newPage.locator("h1.mb-3").innerText();
            expect(newWindowText1).toBe("New Window");
        }
        await newPage.close();

        // Back to main page
        await expect(page).toHaveTitle(/Browser Windows/);
    }
});