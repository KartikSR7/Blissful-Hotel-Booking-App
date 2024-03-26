import express, { Request, Response} from "express";
import Hotel, { HotelType } from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();


// /api/hotels/search?
router.get("/search", async (req: Request, res: Response) => {
    try {
        const pageSize = 5; // Number of hotels per page
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");

        // eg: pageNumber = 3 ( it will multiply by one less no. as one page has 5 )
        const skip = (pageNumber - 1) * pageSize;

        // Cast hotels to HotelType[] to fix type error
        const hotels = (await Hotel.find().skip(skip).limit(pageSize)) as HotelType[];

        const total = await Hotel.countDocuments();

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});


export default  router;
