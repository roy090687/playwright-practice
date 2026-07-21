const { test, expect, request } = require('@playwright/test');

test('send an HTTP GET request using Playwright', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  expect(body.id).toBe(1);
  console.log('Response status:', response.status());
  console.log('Response body:', body);
});