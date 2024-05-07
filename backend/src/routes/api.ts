// Importing necessary modules and functions
import express, { Request, Response } from 'express';
import { PricingInput } from '../shared/types';
import {
  calculateDynamicPrice,
  getRoomData,
  getOccupancyData,
  getCompetitorData,
  getSeasonalData,
} from './pricing';

// Creating an instance of the Express router
const router = express.Router();

// POST /price endpoint to calculate dynamic price
router.post('/price', async (req: Request, res: Response) => {
  try {
    // Destructuring the required fields from the request body
    const { roomType, checkInDate, checkOutDate }: PricingInput = req.body;

    // Validating the required fields
    if (!roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calling the calculateDynamicPrice function with the required fields
    const dynamicPrice = await calculateDynamicPrice({
      roomType,
      checkInDate,
      checkOutDate,
      hotelId: '', // Update this with actual hotelId logic if needed
    });

    // Sending the dynamic price as a JSON response
    res.json({ price: dynamicPrice });
  } catch (error: any) {
    // Logging any errors and sending a 500 Internal Server Error response
    console.error('Error calculating dynamic price:', error);
    res.status(500).json({ error: error.message || 'Error calculating dynamic price' });
  }
});

// GET /roomData/:hotelId/:roomType endpoint to fetch room data
router.get('/roomData/:hotelId/:roomType', async (req, res) => {
  try {
    // Destructuring the required fields from the request parameters
    const { hotelId, roomType } = req.params;

    // Calling the getRoomData function with the required fields
    const roomData = await getRoomData(hotelId);

    // Sending the room data as a JSON response
    res.json(roomData);
  } catch (error: any) {
    // Logging any errors and sending a 500 Internal Server Error response
    console.error('Error fetching room data:', error);
    res.status(500).json({ error: error.message || 'Error fetching room data' });
  }
});

// GET /occupancyData/:hotelId/:roomType/:checkInDate/:checkOutDate endpoint to fetch occupancy data
router.get(
  '/occupancyData/:hotelId/:roomType/:checkInDate/:checkOutDate',
  async (req, res) => {
    try {
      // Destructuring the required fields from the request parameters
      const { hotelId, roomType, checkInDate, checkOutDate } = req.params;

      // Calling the getOccupancyData function with the required fields
      const occupancyData = await getOccupancyData;

      // Sending the occupancy data as a JSON response
      res.json(occupancyData);
    } catch (error: any) {
      // Logging any errors and sending a 500 Internal Server Error response
      console.error('Error fetching occupancy data:', error);
      res.status(500).json({ error: error.message || 'Error fetching occupancy data' });
    }
  }
);

// GET /competitorData/:roomType/:checkInDate/:checkOutDate endpoint to fetch competitor data
router.get(
  '/competitorData/:roomType/:checkInDate/:checkOutDate',
  async (req, res) => {
    try {
      // Destructuring the required fields from the request parameters
      const { roomType, checkInDate, checkOutDate } = req.params;

      // Calling the getCompetitorData function with the required fields
      const competitorData = await getCompetitorData(
        roomType,
        new Date(checkInDate),
        new Date(checkOutDate)
      );

      // Sending the competitor data as a JSON response
      res.json(competitorData);
    } catch (error: any) {
      // Logging any errors and sending a 500 Internal Server Error response
      console.error('Error fetching competitor data:', error);
      res.status(500).json({ error: error.message || 'Error fetching competitor data' });
    }
  }
);

// GET /seasonalData/:checkInDate/:checkOutDate endpoint to fetch seasonal data
router.get(
  '/seasonalData/:checkInDate/:checkOutDate',
  async (req, res) => {
    try {
      // Destructuring the required fields from the request parameters
      const { checkInDate, checkOutDate } = req.params;

      // Calling the getSeasonalData function with the required fields
      const seasonalData = await getSeasonalData;

      // Sending the seasonal data as a JSON response
      res.json(seasonalData);
    } catch (error: any) {
      // Logging any errors and sending a 500 Internal Server Error response
      console.error('Error fetching seasonal data:', error);
      res.status(500).json({ error: error.message || 'Error fetching seasonal data' });
    }
  }
);

// Exporting the router instance
export default router;

// // api.ts
// import express, { Request, Response } from 'express';
// // Importing the PricingInput type from the shared/types module
// import { PricingInput } from '../shared/types';
// // Importing the calculateDynamicPrice function from the pricing module
// import { calculateDynamicPrice } from './pricing';

// // Importing the required functions from the pricing module
// import { getRoomData, getOccupancyData, getCompetitorData, getSeasonalData } from './pricing';

// //import { RoomData, OccupancyData, CompetitorData, SeasonalData } from './ty';

// // Creating an instance of the Express router
// const router = express.Router();

// // Endpoint to handle POST requests to /price
// router.post('/price', async (req: Request, res: Response) => {
//   try {
//     // Destructuring the roomType, checkInDate, and checkOutDate from the request body
//     const { roomType, checkInDate, checkOutDate }: PricingInput = req.body;

//     // Calculating the dynamic price based on the provided input
//     // The hotelId is currently set to an empty string, might need to be updated
//     const dynamicPrice = calculateDynamicPrice({
//       roomType, checkInDate, checkOutDate,
//       hotelId: ''
//     });

//     // Sending the dynamic price as a JSON response
//     res.json({ price: dynamicPrice });
//   } catch (error) {
//     // Handling any errors that occur during the process
//     console.error('Error calculating dynamic price:', error);
//     res.status(500).json({ error: 'Error calculating dynamic price' });
//   }
// });

// // Get the base price of a room for a given room type
// router.get('/roomData/:hotelId/:roomType', async (req, res) => {
//   const { hotelId, roomType } = req.params;
//   const roomData = await getRoomData(hotelId, roomType);
//   res.json(roomData);
// });

// // Get the occupancy percentage of a room for a given room type and date range
// router.get('/occupancyData/:hotelId/:roomType/:checkInDate/:checkOutDate', async (req, res) => {
//   const { hotelId, roomType, checkInDate, checkOutDate } = req.params;
//   const occupancyData = await getOccupancyData(hotelId, roomType, new Date(checkInDate), new Date(checkOutDate));
//   res.json(occupancyData);
// });

// // Get the base price of a room for a given room type and date range from competitors
// router.get('/competitorData/:roomType/:checkInDate/:checkOutDate', async (req, res) => {
//   const { roomType, checkInDate, checkOutDate } = req.params;
//   const competitorData = await getCompetitorData(roomType, new Date(checkInDate), new Date(checkOutDate));
//   res.json(competitorData);
// });

// // Get the season and special events for a given date range
// router.get('/seasonalData/:checkInDate/:checkOutDate', async (req, res) => {
// const { checkInDate, checkOutDate } = req.params;
// const seasonalData = await getSeasonalData(new Date(checkInDate),  new Date(checkOutDate));
// res.json(seasonalData);
// });

// // Exporting the router instance as the default export
// export default router;