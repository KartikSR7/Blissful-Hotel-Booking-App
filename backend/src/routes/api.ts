// api.ts
import express, { Request, Response } from 'express';
// Importing the PricingInput type from the shared/types module
import { PricingInput } from '../shared/types';
// Importing the calculateDynamicPrice function from the pricing module
import { calculateDynamicPrice } from './pricing';

// Creating an instance of the Express router
const router = express.Router();

// Endpoint to handle POST requests to /price
router.post('/price', async (req: Request, res: Response) => {
  try {
    // Destructuring the roomType, checkInDate, and checkOutDate from the request body
    const { roomType, checkInDate, checkOutDate }: PricingInput = req.body;
    
    // Calculating the dynamic price based on the provided input
    // The hotelId is currently set to an empty string, might need to be updated
    const dynamicPrice = calculateDynamicPrice({
      roomType, checkInDate, checkOutDate,
      hotelId: ''
    });

    // Sending the dynamic price as a JSON response
    res.json({ price: dynamicPrice });
  } catch (error) {
    // Handling any errors that occur during the process
    console.error('Error calculating dynamic price:', error);
    res.status(500).json({ error: 'Error calculating dynamic price' });
  }
});

// Exporting the router instance as the default export
export default router;
