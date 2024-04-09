// api.ts
import express, { Request, Response } from 'express';
//import { calculateDynamicPrice } from '../utils/pricing';
import { PricingInput } from '../shared/types';
import { calculateDynamicPrice } from './pricing';


const router = express.Router();

router.post('/price', async (req: Request, res: Response) => {
  try {
    const { roomType, checkInDate, checkOutDate }: PricingInput = req.body;
    const dynamicPrice = calculateDynamicPrice({
      roomType, checkInDate, checkOutDate,
      hotelId: ''
    });
    res.json({ price: dynamicPrice });
  } catch (error) {
    console.error('Error calculating dynamic price:', error);
    res.status(500).json({ error: 'Error calculating dynamic price' });
  }
});


export default router;