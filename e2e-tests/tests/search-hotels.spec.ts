import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5174/";

// This test setup runs before each individual test case, ensuring that the user is signed in and on the homepage.
test.beforeEach(async ({ page }) => {
  // Navigate to the UI_URL, in this case, the homepage of the application.
  await page.goto(UI_URL);

  // Click on the "Sign In" link to initiate the sign-in process.
  await page.getByRole("link", { name: "Sign In" }).click();

  // Ensure that the "Sign In" heading is visible on the sign-in page.
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // Fill in the email and password fields with dummy values for signing in.
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  // Click on the "Login" button to submit the sign-in form.
  await page.getByRole("button", { name: "Login" }).click();

  // Ensure that the "Sign in Successful!" message is visible, indicating a successful sign-in.
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

// Test case: Should show hotel search results.
test("should show hotel search results", async ({ page }) => {
  // Navigate to the homepage.
  await page.goto(UI_URL);

  // Fill in the search input field with a location, in this case, "Dublin".
  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  // Click on the "Search" button to initiate the search.
  await page.getByRole("button", { name: "Search" }).click();

  // Ensure that the search results for hotels in Dublin are visible.
  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});

// Test case: Should show hotel detail.
test("should show hotel detail", async ({ page }) => {
  // Navigate to the homepage.
  await page.goto(UI_URL);

  // Fill in the search input field with a location, in this case, "Dublin".
  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  // Click on the "Search" button to initiate the search.
  await page.getByRole("button", { name: "Search" }).click();

  // Click on the name of a specific hotel, in this case, "Dublin Getaways", to view its details.
  await page.getByText("Dublin Getaways").click();

  // Ensure that the URL contains "detail", indicating that the user has navigated to the hotel detail page.
  await expect(page).toHaveURL(/detail/);

  // Ensure that the "Book now" button is visible on the hotel detail page.
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

// Test case: Should book hotel.
test("should book hotel", async ({ page }) => {
  // Navigate to the homepage.
  await page.goto(UI_URL);

  // Fill in the search input field with a location, in this case, "Dublin".
  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  // Calculate the check-out date, which is three days from the current date.
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];

  // Fill in the check-out date field with the calculated date.
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  // Click on the "Search" button to initiate the search.
  await page.getByRole("button", { name: "Search" }).click();

  // Click on the name of a specific hotel, in this case, "Dublin Getaways", to view its details.
  await page.getByText("Dublin Getaways").click();

  // Click on the "Book now" button to initiate the booking process.
  await page.getByRole("button", { name: "Book now" }).click();

  // Ensure that the total cost of the booking is visible.
  await expect(page.getByText("Total Cost: £357.00")).toBeVisible();

  // Fill in the payment details using Stripe payment form.
  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

  // Click on the "Confirm Booking" button to confirm the booking.
  await page.getByRole("button", { name: "Confirm Booking" }).click();

  // Ensure that the "Booking Saved!" message is visible, indicating a successful booking.
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  // Click on the "My Bookings" link to view the booked hotels.
  await page.getByRole("link", { name: "My Bookings" }).click();

  // Ensure that the booked hotel, in this case, "Dublin Getaways", is visible in the list of bookings.
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});
