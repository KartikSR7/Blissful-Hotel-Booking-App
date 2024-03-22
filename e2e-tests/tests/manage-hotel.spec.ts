import { test, expect } from "@playwright/test";
import path from "path";

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

// Define a test scenario to manage hotel
test("should allow user to manage hotel", async ({ page }) => {
    // Navigate to the add hotels page
    await page.goto(`${UI_URL}/add-hotels`);

    // Fill in hotel details
    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a description for the Test Hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    
    // Select star rating
    await page.selectOption('select[name="starRating"]', "3");
    await page.click('label:has-text("Budget")');
    await page.check('input[name="wifi"]');

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("4");

    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpg")
    ]);

    await page.getByRole('button',{ name: "Save"}).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();
});
