import { test, expect } from '@playwright/test';
import { match } from 'node:assert';

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const USER_EMAIL = "snehasishqa@gmail.com";
const USER_PASSWORD = "5Million$";

/**
 * @param {import('@playwright/test').Page} page
 */
async function login(page) {
    await page.goto(BASE_URL);
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel('password').fill(USER_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('link', { name: "Browse Events →" })).toBeVisible();
}

function getFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead); // move forward by N days

    // Format to yyyy-mm-ddThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


test('e2e: create event via UI, book it and verify booking and seat reduction', async ({ page }) => {
    // ----------------------- Step 1: Login -----------------------
    await login(page);

    // ----------------------- Step 2: Create new event via admin form -----------------------
    await page.goto(`${BASE_URL}/admin/events`);

    // Unique title so we can find this exact card later
    const eventTitle = `Test_Event_${Date.now()}`;
    await page.locator("#event-title-input").fill(eventTitle);
    await page.getByPlaceholder("Describe the event…").fill("Playwright test event");
    await page.locator("#city").fill("Kolkata");
    await page.getByLabel("Venue").fill("Science City");
    const futureDate = getFutureDate(5); // 5 days ahead.
    console.log(futureDate);
    await page.getByLabel("Event Date & Time").fill(futureDate);
    //await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
    await page.getByLabel("Price ($)").fill('100');
    await page.getByLabel("Total Seats").fill('50');
    await page.getByTestId("add-event-btn").click();
    await expect(page.getByText('Event created!')).toBeVisible();
    await expect(page.getByText(eventTitle)).toBeVisible();

    // ----------------------- Step 3: Go to Events page and find the newly created card -----------------------
    // Use getByTestId when data-testid is available
    await page.getByTestId("nav-events").click();
    const eventCards = page.getByTestId("event-card");
    await expect(eventCards.first()).toBeVisible();

    // Scan all the cards and verify our created card to be visible.
    const targetCard = eventCards.filter({ hasText: eventTitle }).first();
    await expect(targetCard).toBeVisible({ timeout: 5000 });

    // Capture the seat count before booking
    const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
    console.log("Seats Before Booking:", seatsBeforeBooking);
    expect(seatsBeforeBooking).toEqual(50);

    // ----------------------- Step 4: Click Book now button -----------------------
    await targetCard.getByTestId("book-now-btn").click();
    await expect(page.locator(`//h1[text()='${eventTitle}']`)).toBeVisible();

    // ----------------------- Step 5: Fill the booking form -----------------------
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await page.getByPlaceholder('Your full name').fill('Bob');
    await page.locator("#customer-email").fill('bob.alston@yahoo.com');
    await page.locator("#phone").fill("7259673478");
    await page.locator(".confirm-booking-btn").click();

    // ----------------------- Step 5: Verify booking confirmation -----------------------
    await expect(page.locator(".text-center")).toContainText('Booking Confirmed!');
    await expect(page.locator(".text-center")).toContainText('Your tickets are reserved.');
    const bookingRef = page.locator(".booking-ref");
    await expect(bookingRef).toBeVisible();
    const bookingRefNumber = await bookingRef.textContent();
    console.log("Bookig ref No:", bookingRefNumber);

    // ----------------------- Step 6: Verify booking appears in My booking -----------------------
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    // First wait for the first card to be visible after clicking the My booking button.
    const bookingCards = page.getByTestId("booking-card");
    await expect(bookingCards.first()).toBeVisible();

    // Find the card that contains our booking ref number [you can use for loop also to achive the below line]
    const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRefNumber }) });
    await expect(matchingCard).toBeVisible();

    // verify event title is also displayed.
    await expect(matchingCard).toContainText(eventTitle);

    // ----------------------- Step 7: Verify seats count reduced by 1 after booking on Event page -----------------------
    await page.goto(`${BASE_URL}/events`);
    await expect(eventCards.first()).toBeVisible();
    await expect(targetCard).toBeVisible();
    // Capture the seat count after booking
    const seatsAfterBooking = parseInt(await targetCard.getByText('seat').first().innerText());
    console.log("Seats After Booking:", seatsAfterBooking);
    // Verify seats count reduced by 1
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
})
