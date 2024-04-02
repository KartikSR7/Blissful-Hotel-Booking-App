import express, { Request, Response } from "express";
import Hotel, { HotelType } from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { ParsedQs } from "qs";
import { param, validationResult } from "express-validator";
const router = express.Router();

router.get("/:id",[

    param("id").notEmpty().withMessage("Hotel ID is required")
  ],async(req: Request, res: Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const id = req.params.id.toString();
    try{
        const hotel = await Hotel.findById(id);
        res.json(hotel);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong with Fetching Hotels"});

    }
  })

router.get("/search", async (req: Request, res: Response) => {
    try {
        // Construct the search query based on the request parameters
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
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
        const hotels = (await Hotel.find(query)
             .sort(sortOptions)
            .skip(skip)
            .limit(pageSize)) as Omit<HotelType, "userId">[];

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



// Function to construct the search query based on request parameters
function constructSearchQuery(queryParams: ParsedQs) {
    const constructedQuery: any = { $or: [] };

    if (queryParams.destination) {
        constructedQuery.$or.push(
            { city: new RegExp(queryParams.destination as string, "i") },
            { country: new RegExp(queryParams.destination as string, "i") }
        );
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
