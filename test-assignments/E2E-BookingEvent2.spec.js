import { test, expect } from '@playwright/test';

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

const EMAIL_USER = { email: "snehasishqa@gmail.com", password: "5Million$" };


/**
 * @param {import('@playwright/test').Page} page
 */
async function loginAndNavigateToBookingPage(page) {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('you@email.com').fill(EMAIL_USER.email);
    await page.locator('#password').fill(EMAIL_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// ─────── Test 1: 1 ticket → eligible ───────
test('refund eligible for single ticket booking', async ({ page }) => {

    await loginAndNavigateToBookingPage(page);

    // Book event with 1 ticket via UI
    await page.goto(`${BASE_URL}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

    // Fill the booking details and verify booking is confirmed
    await page.getByLabel("Full Name").fill("Roy");
    await page.getByPlaceholder("you@email.com").type(EMAIL_USER.email);
    await page.locator('#phone').fill('7259675430');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    const bookingConfirmed = await page.locator('h3.text-xl');
    await expect(bookingConfirmed).toContainText("Booking Confirmed");

    // Navigate to booking detail
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await expect(page.locator('h1.text-3xl')).toHaveText("My Bookings");
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    await page.locator('#check-refund-btn').click();
    // Spinner must appear immediately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    // Wait for spinner to disappear after 4s
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

    // Validate eligible message
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');

});

// ── Test 2: 3 tickets → not eligible ───
test('refund not eligible for group ticket booking', async ({ page }) => {
    const eventName = "World Tech Summit";
    await loginAndNavigateToBookingPage(page);
    await page.getByRole('link', { name: "Browse Events →" }).click();
    const currentUrl = page.url();
    await expect(page).toHaveURL(`${BASE_URL}/events`);
    await expect(currentUrl).toContain("/events");

    // Dynamically select event
    const eventCards = await page.getByTestId("event-card");
    for (let i = 0; i < await eventCards.count(); i++) {
        const eventLink = await eventCards.nth(i).locator('a[href^="/events"] h3').innerText();
        console.log(eventLink);
        if (eventLink.includes(eventName)) {
            await eventCards.nth(i).getByTestId("book-now-btn").click();
            await expect(page).toHaveURL(/\/events\/\d+/); // ensure booking page loaded
            await page.locator('button:has-text("+")').waitFor();
            break;
        }
    }
    // Increase quantity to 3
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await page.getByLabel("Full Name").fill("Decan");
    await page.getByPlaceholder("you@email.com").type(EMAIL_USER.email);
    await page.locator('#phone').fill('7259675430');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Navigate to booking detail
    const bookingRefId = await page.locator(".booking-ref").innerText();
    await page.getByRole('link', { name: "View My Bookings" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    // Dynamically select booking details for the event name using booking ref id
    const bookingCards = await page.locator("#booking-card");
    for (let i = 0; i < await bookingCards.count(); i++) {
        const refId = await bookingCards.nth(i).locator(".booking-ref").innerText();
        if (refId.includes(bookingRefId)) {
            await bookingCards.nth(i).getByRole('link', { name: 'View Details' }).click();
            break;
        }
    }
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

})