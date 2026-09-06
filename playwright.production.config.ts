import { defineConfig, devices } from "@playwright/test";

const externalOrigin = process.env.PRODUCTION_TEST_ORIGIN;
const localOrigin = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "homepage-production.spec.ts",
  workers: 1,
  retries: 0,
  use: {
    baseURL: externalOrigin || localOrigin,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: externalOrigin ? undefined : {
    command: "npm run start -- --port 3100",
    url: localOrigin,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "narrow-mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 740 } } },
  ],
});
