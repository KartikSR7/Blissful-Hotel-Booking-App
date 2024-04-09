// pricing.ts
import { CompetitorData, OccupancyData, RoomData, SeasonalData,  RoomType, PricingInput} from '../shared/types';
//import { RoomType, PricingInput } from '../shared/types';
import axios from 'axios';



async function fetchOccupancyData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<OccupancyData> {
  // Implement the logic to fetch occupancy data from your chosen source
  // This can involve making an API call, querying a database, or scraping a website
  // Example:
  const response = await axios.get(`/api/occupancy?hotelId=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
  return response.data;
}

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

// pricing.ts
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

// Helper functions to fetch data from the database
function getRoomData(roomType: RoomType): RoomData {
  // Fetching room data from the database
  return {
    _id: 'placeholder_id',
    hotelId: 'placeholder_hotel_id',
    roomType,
    basePrice: 100,
  };
}

async function getOccupancyData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<OccupancyData> {
    try {
        // Fetch occupancy data from your hotel management system, a third-party provider, or by scraping it from competitor websites
        const occupancyData = await fetchOccupancyData(hotelId, checkInDate, checkOutDate);
        return occupancyData;
    } catch (error) {
        console.error('Error fetching occupancy data:', error);
        throw error;
    }
    
}

async function getCompetitorData(roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
  // Fetching competitor data from the database
  return {
    _id: '1',
    hotelId: '2',
    roomType,
    checkInDate,
    checkOutDate,
    basePrice: 120,
    averageRating: 4.2,
    location: 'downtown',
    services: ['spa', 'gym'],
  };
}

async function getSeasonalData(hotelId: string, checkInDate: Date, checkOutDate: Date): Promise<SeasonalData> {
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