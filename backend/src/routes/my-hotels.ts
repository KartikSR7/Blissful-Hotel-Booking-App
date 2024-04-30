// Importing necessary modules
import express, { Request, Response } from "express";
import multer from "multer"; // Middleware for handling file uploads
import cloudinary from "cloudinary"; // Cloudinary for image hosting
import Hotel from "../models/hotel"; // Importing the Hotel model
import { HotelType } from "../shared/types"; // Importing types related to hotels
import verifyToken from "../middleware/auth"; // Middleware for user authentication
import { body } from "express-validator"; // Middleware for request body validation

// Creating a router instance from Express
const router = express.Router();

// Configure multer storage for storing images temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Setting the maximum file size to 5MB
    }
});

// Route to handle POST request for creating a new hotel
router.post("/", verifyToken, [
    // Request body validation using express-validator middleware
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night must be numeric"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    body("imageUrls").notEmpty().withMessage("Image URLs are required"),
],
    // Handling file uploads using multer middleware
    upload.array("imageFiles", 6), async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[]; // Extracting uploaded image files
            const newHotel: any = req.body; // Extracting hotel details from request body

            // Uploading images to Cloudinary and getting their URLs
            const imageUrls = await uploadImages(imageFiles);
            newHotel.imageUrls = imageUrls; // Assigning image URLs to the new hotel
            newHotel.lastUpdated = new Date(); // Setting the last updated timestamp
            newHotel.userId = req.userId; // Assigning the user ID to the new hotel

            // Creating a new instance of the Hotel model with the new hotel data
            const hotel = new Hotel(newHotel);
            await hotel.save(); // Saving the new hotel to the database

            // Sending the newly created hotel as JSON response
            res.status(201).json(hotel);
        } catch (error) {
            console.error("Error creating a Hotel: ", error); // Logging any errors that occur
            res.status(500).json({ message: "Something went wrong" }); // Sending an error response
        }
    });

// Route to handle GET request for fetching all hotels
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId }); // Finding hotels owned by the current user
        res.json(hotels); // Sending the fetched hotels as JSON response
    } catch (error) {
        console.error("Error fetching hotels: ", error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong" }); // Sending an error response
    }
});

// Route to handle GET request for fetching a single hotel by ID
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString(); // Extracting hotel ID from request parameters
    try {
        // Finding a hotel by its ID and the current user's ID
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });
        if (!hotel) {
            return res.status(404).json({ message: `Hotel not found` }); // Sending an error response if hotel not found
        }
        res.json(hotel); // Sending the fetched hotel as JSON response
    } catch (error) {
        console.error("Error fetching hotel: ", error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong" }); // Sending an error response
    }
});

// Route to handle PUT request for updating a hotel by ID
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
    try {
        const updatedHotel: HotelType = req.body; // Extracting updated hotel details from request body
        updatedHotel.lastUpdated = new Date(); // Updating the last updated timestamp

        // Finding and updating the hotel by its ID and the current user's ID
        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true }); // Returning the updated document

        if (!hotel) return res.status(404).json({ message: 'Hotel not found' }); // Sending an error response if hotel not found

        // Uploading images to Cloudinary and updating image URLs in the database
        const files = req.files as Express.Multer.File[];
        const updateImageUrls = await uploadImages(files);

        // Updating image URLs of the hotel with newly uploaded images
        hotel.imageUrls = [
            ...updateImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];

        await hotel.save(); // Saving the updated hotel to the database
        res.status(200).json(hotel); // Sending the updated hotel as JSON response
    } catch (error) {
        console.error("Error updating hotel: ", error); // Logging any errors that occur
        res.status(500).json({ message: "Something went wrong" }); // Sending an error response
    }
})

// Function to upload images to Cloudinary and return their URLs
async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64"); // Converting image buffer to base64 string
        const dataURI = "data:" + image.mimetype + ";base64," + b64; // Creating data URI from base64 string
        const result = await cloudinary.v2.uploader.upload(dataURI); // Uploading image to Cloudinary
        return result.url; // Returning the URL of the uploaded image
    });

    // If upload was successful, add the URLs to the new hotel
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls; // Returning the array of image URLs
}

export default router; // Exporting the router instance
