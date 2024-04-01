import { test, expect } from "@playwright/test";

// Define the URL of the user interface
const UI_URL = "http://localhost:5173/";

// Define a test fixture to run before each test
test.beforeEach(async ({ page }) => {
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
});

test("Should show hotel search resuts", async({page})=>{
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Dublin")
    await page.getByRole("button", {name: "Search"}).click();

    await expect(page.getByText("Hotels found in Dublin:")).toBeVisible();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();
});