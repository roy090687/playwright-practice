const { test, expect } = require('@playwright/test');

test("Calander validation", async ({ page }) => {
    const month = "6";
    const date = "15";
    const year = "2027";
    const expectedList = [month, date, year];
    const url = 'https://rahulshettyacademy.com/seleniumPractise/#/offers';

    await page.goto(url);
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator('.react-calendar__year-view__months__month').nth(Number(month - 1)).click();
    await page.locator("//abbr[text()='" + date + "']").click();

    // Assertion for checking the exact values in the calander box.
    const inputs = page.locator('.react-date-picker__inputGroup input[type="number"]');
    const actualList = [];
    for (let i = 0; i < await inputs.count(); i++) {
        const value = await inputs.nth(i).inputValue();
        console.log(`Input ${i}: ${value}`);
        actualList.push(value);
    }

    expect(actualList).toEqual(expectedList);
});