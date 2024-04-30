// Importing necessary modules
import express, { Request, Response } from "express";
import { BookingType, HotelSearchResponse, HotelType } from "../shared/types";
import { ParsedQs } from "qs"; // Importing a type from the 'qs' library
import { param, validationResult } from "express-validator"; // Importing validation functions from Express Validator
import Stripe from "stripe"; // Importing the Stripe library for payment processing
import verifyToken from "../middleware/auth"; // Importing authentication middleware
import Hotel from "../models/hotel"; // Importing the Hotel model

// Creating a new instance of Stripe with the API key
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

// Creating a router instance from Express
const router = express.Router();

// Route to fetch all hotels
router.get("/", async (req: Request, res: Response) =>{
    try {
        // Fetching all hotels and sorting them based on the 'lastUpdated' field
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels); // Sending the fetched hotels as JSON response
    } catch(error) {
        console.log("error", error); // Logging any errors that occur
        res.status(500).json({message: "Error fetching hotels"}); // Sending an error response if fetching fails
    }
});

// Route to fetch a single hotel by its ID
router.get("/:id", [
    param("id").notEmpty().withMessage("Hotel ID is required") // Validation for hotel ID parameter
], async (req: Request, res: Response) => {
    const errors = validationResult(req); // Checking for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Sending validation errors as response if any
    }

    const id = req.params.id.toString(); // Extracting hotel ID from request parameters
    try {
        const hotel = await Hotel.findById(id); // Finding a hotel by its ID
        res.json(hotel); // Sending the fetched hotel as JSON response
    } catch (error) {
        console.log(error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong with Fetching Hotels" }); // Sending an error response if fetching fails
    }
});

// Route to search hotels based on query parameters
router.get("/search", async (req: Request, res: Response) => {
    try {
        // Constructing search query based on request parameters
        const query = constructSearchQuery(req.query);

        // Sorting options based on request parameters
        let sortOptions: any = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 }; // Sorting by star rating in descending order
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 }; // Sorting by price per night in ascending order
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 }; // Sorting by price per night in descending order
                break;
        }

        // Pagination variables
        const pageSize = 5; // Number of hotels per page
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1"); // Current page number
        const skip = (pageNumber - 1) * pageSize; // Number of documents to skip

        // Finding hotels matching the query, sorting and paginating
        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize) as HotelType[];

        // Counting total number of hotels matching the query for pagination
        const total = await Hotel.countDocuments(query);

        // Constructing response object with hotels and pagination details
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            }
        };

        // Sending the response
        res.json(response);
    } catch (error) {
        console.log("error", error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong" }); // Sending an error response if searching fails
    }
});

// Route to create a payment intent for booking
router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body; // Extracting number of nights from request body
        const hotelId = req.params.hotelId; // Extracting hotel ID from request parameters

        const hotel = await Hotel.findById(hotelId); // Finding hotel by ID
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" }); // Sending error response if hotel not found
        }

        const totalCost = hotel.pricePerNight * numberOfNights; // Calculating total cost of booking

        // Creating a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100, // Converting total cost to cents
            currency: "gbp", // Setting currency to GBP
            metadata: {
                hotelId,
                userId: req.userId ?? null, // Adding metadata for hotel ID and user ID
            },
        });

        // Sending the payment intent details as response
        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret?.toString() ?? null,
            totalCost,
        };

        res.send(response); // Sending the response
    } catch (error) {
        console.log("Error creating payment intent:", error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong while creating payment intent" }); // Sending an error response if creation fails
    }
});

// Route to create a booking
router.post("/:hotelId/bookings", verifyToken, async (req: Request, res: Response) => {
    try {
        const paymentIntentId = req.body.paymentId; // Extracting payment intent ID from request body

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId); // Retrieving payment intent from Stripe

        if (!paymentIntent) {
            return res.status(400).json({ message: "Payment intent not found" }); // Sending error response if payment intent not found
        }

        // Checking if payment intent matches the hotel ID and user ID
        if (paymentIntent.metadata.hotelId !== req.params.hotelId 
            || paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "Payment intent mismatch" }); // Sending error response if mismatch
        }

        // Checking if payment is successful
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: `Payment is not successful yet. Status: ${paymentIntent.status}` }); // Sending error response if payment is not successful
        }

        // Creating a new booking object
        const newBooking: BookingType = {
            ...req.body, // Assuming req.body contains booking information
            userId: req.userId // Adding user ID to the booking
        };

        // Finding the hotel by ID and adding the new booking
        const hotel = await Hotel.findOneAndUpdate(
            { _id: req.params.hotelId },
            { $push: { bookings: newBooking } }
        );

        if (!hotel) {
            return res.status(400).json({ message: "Hotel does not exist!" }); // Sending error response if hotel does not exist
        }

        await hotel.save(); // Saving the hotel after adding the booking
        res.status(200).send(); // Sending success response
    } catch (error) {
        console.error("Error creating booking:", error); // Logging any errors that occur
        return res.status(500).json({ message: "Something went wrong while creating booking" }); // Sending error response if creation fails
    }
});

// Function to construct the search query based on request parameters
const constructSearchQuery = (queryParams: ParsedQs) => {
    const constructedQuery: any = {}; // Initializing an empty object for the query

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination as string, "i") },
            { country: new RegExp(queryParams.destination as string, "i") }
        ]; // Adding destination search condition to the query
    }

    // Adding filters based on request parameters
    if (queryParams.adultCount) {
        constructedQuery.adultCount = { $gte: parseInt(queryParams.adultCount as string) };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]
        }; // Adding facilities filter to the query
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types]
        }; // Adding types filter to the query
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars) ?
            queryParams.stars.map((star) => parseInt(star as string)) :
            [parseInt(queryParams.stars as string)];

        constructedQuery.starRating = { $in: starRatings }; // Adding star ratings filter to the query
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice as string)
        }; // Adding max price filter to the query
    }

    return constructedQuery; // Returning the constructed query
}

export default router; // Exporting the router instance
