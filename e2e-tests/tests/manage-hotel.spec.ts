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
    await page.getByText('[name="name"]').fill("Test Hotel");
    await page.getByText('[name="city"]').fill("Test City");
    await page.getByText('[name="country"]').fill("Test Country");
    await page.getByText('[name="description"]').fill("This is a description for the Test Hotel");
    await page.getByText('[name="pricePerNight"]').fill("100");
    
    // Select star rating
    await page.selectOption('select[name="starRating"]', "3");
    await page.click('label:has-text("Budget")');
    await page.check('input[name="wifi"]');

    await page.getByText('[name="adultCount"]').fill("2");
    await page.getByText('[name="childCount"]').fill("4");

    // Set input files for hotel images
    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpg")
    ]);

    // Click on the save button
    await page.click('button:has-text("Save")');
    // Expect success message after saving hotel
    await expect(page.locator('div:has-text("Hotel Saved!")')).toBeVisible();
});

// Define a test scenario to view hotels
test("should allow user to view hotels", async ({ page }) => {
    // Navigate to the user's hotels page
    await page.goto(`${UI_URL}/my-hotels`);

    // Expect various details of a hotel to be visible
    await expect(page.getByText('div:has-text("Dublin Gateaways")')).toBeVisible();
    await expect(page.getByText('div:has-text("Lorem ipsum dolor sit amet")')).toBeVisible();
    await expect(page.getByText('div:has-text("Dublin, Ireland")')).toBeVisible();
    await expect(page.getByText('div:has-text("All Inclusive")')).toBeVisible();
    await expect(page.getByText('div:has-text("£119 per night")')).toBeVisible();
    await expect(page.getByText('div:has-text("2 adults, 3 children")')).toBeVisible();
    await expect(page.getByText('div:has-text("2 Star Rating")')).toBeVisible();
    await expect(page.getByText('a:has-text("View Details")')).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await page.getByRole("link", { name: "View Details"}).first().click(); 

    await page.waitForSelector('[name="name"]',{ state: "attached"});
    await expect(page.locator('[name="name"]' )).toHaveValue(/Dublin Gateways/i) ;
    await page.locator('[name="name"]').fill("Updated Dublin Gateways");
    await page.getByRole("button", { name: "Save"}).click();
    await  expect(page.getByText("Hotel Saved!")).toBeVisible();

    await page.reload();

    await expect(page.locator('[name="name"]')).toHaveValue("Updated Dublin Gateways");

    await page.locator('[name="name"]').fill("Dublin Gateways");
    await page.getByRole("button", { name: "Save"}).click();

});
