import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import  { HotelType } from '../shared/types';
import Hotel from "../models/hotel";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Find all hotels that have bookings associated with the logged-in user
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    // Map over the hotels and create a new array with the user's bookings
    const results = hotels.map((hotel) => {
      // Filter the hotel's bookings to only include the ones belonging to the logged-in user
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      // Create a new HotelType object with the user's bookings
      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });
    res.status(200).send(results);
    
    // Send the results back to the client
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;