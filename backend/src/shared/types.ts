import Hotel from "../models/hotel";


export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type HotelType = {
    
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
    newProperty: string; 
    bookings: BookingType[];
  };

  export type BookingType ={
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number; 
    childCount: number; 
    checkIn: Date; 
    checkOut: Date;
    totalCost: number;  
  }
  export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    }
  }
  
  export default HotelSearchResponse;

  export type PaymentIntentResponse ={
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  }

  //dynamic pricng 

  export type RoomType = string;

export interface PricingInput {
  roomType: RoomType;
  checkInDate: Date;
  checkOutDate: Date;
}

export interface RoomData {
  basePrice: number;
  // Add any other relevant room data properties
}

export interface OccupancyData {
    occupancyPercentage: number;
  // Add relevant occupancy data properties
}

export interface CompetitorData {
    basePrice: any;
    averageRating: any;
    location: any;
    services: any[];
  // Add relevant competitor data properties
}
export interface SeasonalData {
  currentSeason: any;
  isSpecialEvent: any;
// Add relevant occupancy data properties
}
