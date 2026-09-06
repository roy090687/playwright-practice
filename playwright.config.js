import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';

const config = ({
  testDir: './tests',   // root directory
  testMatch: '**/*.spec.js',
  retries: 0,

  /*Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on', // on, off, retain-on-failure
    video: 'retain-on-failure',
  },

});
module.exports = config

