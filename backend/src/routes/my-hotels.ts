import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
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
    body ("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    body ("imageUrls").notEmpty().withMessage("Name is required"),
],
upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel = req.body;

        // 1. Upload the images to Cloudinary
        const uploadPromises = imageFiles.map(async (imageFile) => {
            const b64 = Buffer.from(imageFile.buffer).toString("base64");
            const dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
            const result = await cloudinary.v2.uploader.upload(dataURI);
            return result.url;
        });

        // 2. If upload was successful, add the URLs to the new hotel
        const imageUrls = await Promise.all(uploadPromises);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        // 3. Save the new hotel in the database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        // 4. Return the new hotel
        res.status(201).json(hotel);
    } catch (error) {
        console.error("Error creating a Hotel: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
