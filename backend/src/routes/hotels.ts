import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { ParsedQs } from "qs";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";


const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/", async (req: Request,  res: Response) =>{
    try{
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels);
    }catch(error){
     console.log("error", error);
     res.status(500).json({message: "Error fetching hotels"});
    }

})

router.get("/:id", [

    param("id").notEmpty().withMessage("Hotel ID is required")
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong with Fetching Hotels" });

    }
})

router.get("/search", async (req: Request, res: Response) => {
    try {
        // Construct the search query based on the request parameters
        const query = constructSearchQuery(req.query);

        let sortOptions: any = {};
        switch (req.query.sortOption) {
            case "starRating":
                // to sort the results based on str rating from highest to low that is why -1
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }
        const pageSize = 5; // Number of hotels per page
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        // Find hotels matching the query, skipping and limiting based on pagination
        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize) as HotelType[];

        // Count total number of hotels matching the query for pagination
        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            }
        };

        // Send the response containing hotels and pagination details
        res.json(response);
    } catch (error) {
        // Handle any errors that occur during the search process
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});


router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        const totalCost = hotel.pricePerNight * numberOfNights;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost*100,  // Stripe uses pence not pounds £1=100p
            currency: "gbp",
            metadata: {
                hotelId,
                userId: req.userId,
            },
        });
        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "Error creating payment intent" });
        }

        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        };

        res.send(response);
    } catch (error) {
        console.log("Error creating payment intent:", error);
        res.status(500).json({ message: "Something went wrong while creating payment intent" });
    }
});

router.post("/:hotelId/bookings", verifyToken, async (req: Request, res: Response) => {
    try {
        const paymentIntentId = req.body.paymentId;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return res.status(400).json({ message: "Payment intent not found" });
        }

        if (paymentIntent.metadata.hotelId !== req.params.hotelId 
            || paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "Payment intent mismatch" });
        }

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: `Payment is not successful yet. Status: ${paymentIntent.status}` });
        }

        // Assuming BookingType is defined somewhere
        const newBooking: BookingType = {
            // Assuming req.body contains booking information
            ...req.body,
            userId: req.userId
        };

    const hotel  = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId},
        {
            $push: { bookings : newBooking},
        }
    );

    if(!hotel){
        return res.status(400).json({message: "Hotel does not exist!"})
    }

    await hotel.save();
    res.status(200).send();

        // Proceed to create the booking with the newBooking object

        // Return success response
        return res.status(200).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ message: "Something went wrong while creating booking" });
    }
});

// Function to construct the search query based on request parameters
const constructSearchQuery = (queryParams: ParsedQs) => {
    const constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination as string, "i") },
            { country: new RegExp(queryParams.destination as string, "i") }
        ];
    }

    // Add filters based on request parameters
    if (queryParams.adultCount) {
        constructedQuery.adultCount = { $gte: parseInt(queryParams.adultCount as string) };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            // Finding the hotels that have all the facilities as selected
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            // Checking if we received one type or many types
            $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types]
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars) ?
            queryParams.stars.map((star) => parseInt(star as string)) :
            [parseInt(queryParams.stars as string)];

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            // Where max price per night is less than or equal to
            $lte: parseInt(queryParams.maxPrice as string)
        };
    }

    return constructedQuery;
}

export default router;
