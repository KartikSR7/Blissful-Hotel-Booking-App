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

    // Set input files for hotel images
    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpg")
    ]);

    // Click on the save button
    await page.getByRole('button',{ name: "Save"}).click();
    // Expect success message after saving hotel
    await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

// Define a test scenario to view hotels
test("should allow user to view hotels", async ({ page }) => {
    // Navigate to the user's hotels page
    await page.goto(`${UI_URL}/my-hotels`);

    // Expect various details of a hotel to be visible
    await expect(page.getByText("Dublin Gateaways")).toBeVisible();
    await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
    await expect(page.getByText("Dublin, Ireland")).toBeVisible();
    await expect(page.getByText("All Inclusive")).toBeVisible();
    await expect(page.getByText("£119 per night")).toBeVisible();
    await expect(page.getByText("2 adults, 3 children")).toBeVisible();
    await expect(page.getByText("2 Star Rating")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Details"})).toBeVisible();
});
