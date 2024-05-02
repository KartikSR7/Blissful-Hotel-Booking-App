// pricing.ts
import { RoomData, SeasonalData, RoomType, PricingInput, OccupancyData } from '../shared/types';

import axios from 'axios';
import CompetitorData from './CompetitorData';
import { MongoClient } from 'mongodb';
//import { getRoomData, getOccupancyData, getCompetitorData, getSeasonalData } from './pricing';
// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Fetch occupancy data from an API endpoint or your hotel management system
async function fetchOccupancyData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<OccupancyData> {
  const response = await axios.get(`/api/occupancy?hotelId=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
  return response.data;
}

// Calculate dynamic price based on room, occupancy, competitor, and seasonal data
export async function calculateDynamicPrice(input: PricingInput): Promise<number> {
  const { roomType, hotelId, checkInDate, checkOutDate } = input;

  // Fetching relevant data from the database
  const roomData = getRoomData(roomType);
  const occupancyData = await getOccupancyData(hotelId, checkInDate, checkOutDate);
  const competitorData = await getCompetitorData(roomType, checkInDate, checkOutDate);
  const seasonalData = await getSeasonalData(hotelId, checkInDate, checkOutDate);

  // Implementing the pricing algorithm
  let price = roomData.basePrice;

  // Adjusting price based on demand (occupancy)
  price *= getOccupancyPricingFactor(occupancyData, seasonalData);

  // Adjusting price based on competition
  price *= getCompetitionPricingFactor(roomData, competitorData);

  return price;
}

// Helper function to calculate the occupancy pricing factor
function getOccupancyPricingFactor(occupancyData: OccupancyData, seasonalData: SeasonalData): number {
  const { occupancyPercentage, totalRooms, occupiedRooms } = occupancyData;
  const { currentSeason, isSpecialEvent } = seasonalData;
  let pricingFactor = 1;

  // Apply a higher pricing factor when occupancy is high
  if (occupancyPercentage >= 90) {
    pricingFactor = 1.5;
  } else if (occupancyPercentage >= 80) {
    pricingFactor = 1.2;
  }
  // Apply a lower pricing factor when occupancy is low
  else if (occupancyPercentage <= 50) {
    pricingFactor = 0.8;
  }
  // Apply a gradually increasing pricing factor as occupancy increases
  else if (occupancyPercentage >= 70) {
    pricingFactor = 1 + (occupancyPercentage - 70) / 100 * 0.5;
  }
  // Apply a gradually decreasing pricing factor as occupancy decreases
  else if (occupancyPercentage <= 30) {
    pricingFactor = 0.7 + occupancyPercentage / 100 * 0.3;
  }

  // Apply a higher pricing factor during peak season or special events
  if (currentSeason === 'high' || isSpecialEvent) {
    pricingFactor *= 1.3;
  }

  return pricingFactor;
}

// Helper function to calculate the competition pricing factor
function getCompetitionPricingFactor(roomData: RoomData, competitorData: CompetitorData): number {
  const { basePrice: roomBasePrice } = roomData;
  const { basePrice: competitorBasePrice, averageRating, location, services } = competitorData;

  // Calculate the initial pricing factor based on base prices
  let pricingFactor = competitorBasePrice / roomBasePrice;

  // Adjust the pricing factor based on the competitor's rating
  if (averageRating > 4.5) {
    pricingFactor *= 1.1; // Increase the pricing factor for high-rated competitors
  } else if (averageRating < 3.5) {
    pricingFactor *= 0.9; // Decrease the pricing factor for low-rated competitors
  }

  // Adjust the pricing factor based on the competitor's location
  if (location === 'downtown') {
    pricingFactor *= 1.2; // Increase the pricing factor for competitors in the downtown area
  } else if (location === 'suburbs') {
    pricingFactor *= 0.8; // Decrease the pricing factor for competitors in the suburbs
  }

  // Adjusting the pricing factor based on the competitor's services
  if (services.includes('spa') || services.includes('gym')) {
    pricingFactor *= 1.1; // Increase the pricing factor for competitors with additional services
  }

  return pricingFactor;
}

// Helper function to fetch room data from the database
export function getRoomData(roomType: RoomType): RoomData {
  // Fetching room data from the database
  return {
    _id: 'placeholder_id',
    hotelId: 'placeholder_hotel_id',
    roomType,
    basePrice: 100,
  };
}

// Helper function to fetch occupancy data from the database
export async function getOccupancyData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<OccupancyData> {
  try {
    // Fetch occupancy data from your hotel management system, a third-party provider, or by scraping it from competitor websites
    const occupancyData = await fetchOccupancyData(hotelId, checkInDate, checkOutDate);
    return occupancyData;
  } catch (error) {
    console.error('Error fetching occupancy data:', error);
    throw error;
  }
}

// Helper function to fetch competitor data from the database
export async function getCompetitorData(roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
  try {
    // Fetch competitor data from the competitor's website
    const competitorData: CompetitorData = await data(roomType, checkInDate, checkOutDate);
    return competitorData;
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw error;
  }
}

// Helper function to fetch seasonal data from the database
export async function getSeasonalData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<SeasonalData> {
  // Fetch seasonal data from the database
  return {
    _id: '1',
    hotelId,
    checkInDate,
    checkOutDate,
    currentSeason: 'high',
    isSpecialEvent: false,
  };
}

// Placeholder function for fetching competitor data from a third-party API
function data(roomType: string, checkInDate: Date, checkOutDate: Date): CompetitorData | PromiseLike<CompetitorData> {
  throw new Error('Function not implemented.');
}

// //Helper functions to fetch data from the database
// export const getRoomData = async (hotelId: string, roomType: string): Promise<RoomData[]> => {
//   await client.connect();
//   const roomData = await client.db('hotelDB').collection('roomData').find({ hotelId, roomType }).toArray();
//   await client.close();
//   return roomData;
// }

// export const getOccupancyData = async (hotelId: string, roomType: string, checkInDate: Date, checkOutDate: Date): Promise<OccupancyData[]> => {
//   await client.connect();
//   const occupancyData = await client.db('hotelDB').collection('occupancyData').find({ hotelId, roomType, checkInDate, checkOutDate }).toArray();
//   await client.close();
//   return occupancyData;
// }

// export const getCompetitorData = async (roomType: string, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData[]> => {
//   await client.connect();
//   const competitorData = await client.db('hotelDB').collection('competitorData').find({ roomType, checkInDate, checkOutDate }).toArray();
//   await client.close();
//   return competitorData;
// }

// export const getSeasonalData = async (checkInDate: Date, checkOutDate: Date): Promise<SeasonalData[]> => {
//   await client.connect();
//   const seasonalData = await client.db('hotelDB').collection('seasonalData').find({ checkInDate, checkOutDate }).toArray();
//   await client.close();
//   return seasonalData;
// }




// Old commented out code
// export { getRoomData, getOccupancyData, getCompetitionPricingFactor,getOccupancyPricingFactor,getCompetitorData, getSeasonalData };

// Old commented out code
// export default async function (roomType: string, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
//   try {
//     // Fetch competitor data from API
//     const response = await fetch(`https://example.com/api/competitors?roomType=${roomType}&checkIn=${checkInDate}&checkOut=${checkOutDate}`);
//     const data = await response.json();

//     return data;

//   } catch (error) {
//     console.error('Error fetching competitor data from API:', error);
//     throw error;
//   }
// }