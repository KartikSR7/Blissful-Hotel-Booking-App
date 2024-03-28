import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Handle POST request to create a new hotel
router.post("/", verifyToken, [
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night must be numeric"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    body("imageUrls").notEmpty().withMessage("Image URLs are required"),
],
    upload.array("imageFiles", 6), async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: any = req.body;

            // 1. Upload the images to Cloudinary
            const imageUrls = await uploadImages(imageFiles);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            // 2. Save the new hotel in the database
            const hotel = new Hotel(newHotel);
            await hotel.save();

            // 3. Return the new hotel
            res.status(201).json(hotel);
        } catch (error) {
            console.error("Error creating a Hotel: ", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    });


router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId })
        res.json(hotels)
    } catch (error) {
        console.error("Error fetching hotels: ", error);
        res.status(500).json({ message: "Something went wrong" })
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });
        if (!hotel) {
            return res.status(404).json({ message: `Hotel not found` });
        }
        res.json(hotel);
    } catch (error) {
        console.error("Error fetching hotel: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true });
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Save images to cloudinary and update imageUrls in the database with the returned urls from Cloudinary
        const files = req.files as Express.Multer.File[];
        const updateImageUrls = await uploadImages(files);

        hotel.imageUrls = [
            ...updateImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];

        await hotel.save();
        res.status(200).json(hotel);
    } catch (error) {
        console.error("Error updating hotel: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        const dataURI = "data:" + image.mimetype + ";base64," + b64;
        const result = await cloudinary.v2.uploader.upload(dataURI);
        return result.url;
    });

    // If upload was successful, add the URLs to the new hotel
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
