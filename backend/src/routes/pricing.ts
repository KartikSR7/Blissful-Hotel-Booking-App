// pricing.ts
import { CompetitorData, OccupancyData, RoomData, SeasonalData } from '../shared/types';
import { RoomType, PricingInput } from '../shared/types';

export function calculateDynamicPrice(input: PricingInput): number {
  const { roomType, checkInDate, checkOutDate } = input;

  // Fetch relevant data from the database
  const roomData = getRoomData(roomType);
  const occupancyData = getOccupancyData(checkInDate, checkOutDate);
  const competitorData = getCompetitorData(roomType, checkInDate, checkOutDate);
  const seasonalData = getSeasonalData(checkInDate, checkOutDate);

  // Implement the pricing algorithm
  let price = roomData.basePrice;

  // Adjust price based on demand (occupancy)
  price *= getOccupancyPricingFactor(occupancyData, seasonalData);

  // Adjust price based on competition
  price *= getCompetitionPricingFactor(roomData, competitorData);

  return price;
}

function getOccupancyPricingFactor(occupancyData: OccupancyData, seasonalData: SeasonalData): number {
  const { occupancyPercentage } = occupancyData;
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
  
    // Adjust the pricing factor based on the competitor's services
    if (services.includes('spa') || services.includes('gym')) {
      pricingFactor *= 1.1; // Increase the pricing factor for competitors with additional services
    }
  
    return pricingFactor;
  }

// Helper functions to fetch data from the database
function getRoomData(roomType: RoomType): RoomData {
  // Fetch room data from the database
  return {
    basePrice: 100,
  };
}

function getOccupancyData(checkInDate: Date, checkOutDate: Date): OccupancyData {
  // Fetch occupancy data from the database
  return {
    occupancyPercentage: 50,
  };
}

function getCompetitorData(roomType: RoomType, checkInDate: Date, checkOutDate: Date): CompetitorData {
    // Fetch competitor data from the database
    return {
        basePrice: 120,
        averageRating: 4.2,
        location: 'downtown',
        services: ['spa', 'gym']
    };
}

function getSeasonalData(checkInDate: Date, checkOutDate: Date): SeasonalData {
  // Fetch seasonal data from the database
  return {
    currentSeason: 'high',
    isSpecialEvent: false,
  };
}