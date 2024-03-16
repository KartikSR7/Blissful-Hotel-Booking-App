import { test, expect } from '@playwright/test';

// Define the URL of the user interface
const UI_URL = "http://localhost:5173/";

// Test to check signing in functionality
test('should allow the user to sign in', async ({ page }) => {
  // Navigate to the UI URL
  await page.goto(UI_URL);

  // Click on the "Sign In" button
  await page.click('a:has-text("Sign In")');
  
  // Expect the "Sign In" heading to be visible
  await expect(page.locator('h1:has-text("Sign In")')).toBeVisible();

  // Fill in email and password fields
  await page.fill('[name=email]', '1@1.com');
  await page.fill('[name=password]', 'password123');

  // Click on the "Login" button
  await page.click('button:has-text("Login")');

  // Expect success message and navigation links to be visible after successful sign in
  await expect(page.locator('div:has-text("Sign in Successful")')).toBeVisible();
  await expect(page.locator('a:has-text("My Bookings")')).toBeVisible();
  await expect(page.locator('a:has-text("My Hotels")')).toBeVisible();
  await expect(page.locator('a:has-text("Sign Out")')).toBeVisible();
});

// Test to check user registration functionality
test("should allow user to register", async ({ page }) => {
  // Generate a random email for testing
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`;

  // Navigate to the UI URL
  await page.goto(UI_URL);

  // Click on the "Sign In" button
  await page.click('a:has-text("Sign In")');

  // Click on the "Create an account here" link
  await page.click('a:has-text("Create an account here")');

  // Expect the "Create an Account" heading to be visible
  await expect(page.locator('h1:has-text("Create an Account")')).toBeVisible();

  // Fill in registration form fields
  await page.fill('[name=firstName]', 'test_firstName');
  await page.fill('[name=lastName]', 'test_lastName');
  await page.fill('[name=email]', testEmail);
  await page.fill('[name=password]', 'password123');
  await page.fill('[name=confirmPassword]', 'password123');

  // Click on the "Create Account" button
  await page.click('button:has-text("Create Account")');

  // Expect registration success message and navigation links to be visible
  await expect(page.locator('div:has-text("Registration Successful!")')).toBeVisible();
  await expect(page.locator('a:has-text("My Bookings")')).toBeVisible();
  await expect(page.locator('a:has-text("My Hotels")')).toBeVisible();
  await expect(page.locator('a:has-text("Sign Out")')).toBeVisible();
});

// Test to check title of a webpage
test('has title', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Expect the title to contain "Playwright"
  await expect(page.title()).toMatch(/Playwright/);
});

// Test to check the "Get started" link functionality
test('get started link', async ({ page }) => {
  // Navigate to the Playwright website
  await page.goto('https://playwright.dev/');

  // Click the "Get started" link
  await page.click('a:has-text("Get started")');

  // Expect the page to have a heading with the name of "Installation"
  await expect(page.locator('h1:has-text("Installation")')).toBeVisible();
});
