import { test, expect } from '@playwright/test';

test('Dynamic table validation for Guru99 SEO page', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://demo.guru99.com/seo/page-2.html');

    // Locate the table
    const table = page.locator('.table');

    // Headers only from first tbody
    const headers = table.locator('//tbody[1]/tr/th');
    const headerCount = await headers.count();

    let courseNameCol = -1;
    let courseContentCol = -1;

    for (let i = 0; i < headerCount; i++) {
        const headerText = (await headers.nth(i).innerText()).trim();
        if (headerText.toLowerCase() === 'course name') {
            courseNameCol = i;
        } else if (headerText.toLowerCase() === 'course content') {
            courseContentCol = i;
        }
    }

    // Rows only from second tbody (data rows)
    const rows = table.locator('//tbody[2]/tr');
    const rowCount = await rows.count();

    const targetCourseName = 'AWS Concepts';
    const expCourseContent =
        'This course is to provide a simple, conceptual introduction to the concepts of Cloud Computing and Amazon Web Services.';

    let actualCourseContent = null;

    for (let i = 0; i < rowCount; i++) {
        const cells = rows.nth(i).locator('td');
        const cellCount = await cells.count();
        if (cellCount === 0) continue; // skip empty rows

        // Course name is inside <a>
        const courseName = await cells.nth(courseNameCol).locator('a').innerText();

        if (courseName.toLowerCase() === targetCourseName.toLowerCase()) {
            actualCourseContent = await cells.nth(courseContentCol).innerText();
            break;
        }
    }

    console.log(`Course is: ${targetCourseName} and the content is => ${actualCourseContent}`);
    await expect(actualCourseContent).toBe(expCourseContent);
});
