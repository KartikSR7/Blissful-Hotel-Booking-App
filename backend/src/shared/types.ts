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
  hotelId: string;
  roomType: RoomType;
  checkInDate: Date;
  checkOutDate: Date;
}

export interface RoomData {
  _id: string;
  hotelId: string; // Reference to the hotel in the "hotels" collection
  roomType: string;
  basePrice: number;

}

export interface OccupancyData {
  _id: string;
  hotelId: string; // Reference to the hotel in the "hotels" collection
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  occupancyPercentage: number;
  totalRooms: number;
  occupiedRooms: number;
 
}

export interface CompetitorData {
  _id: string;
  hotelId: string; // Reference to the hotel in the "hotels" collection
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  basePrice: number;
  averageRating: number;
  location: string;
  services: string[];
  
}

export interface SeasonalData {
  _id: string;
  hotelId: string; // Reference to the hotel in the "hotels" collection
  checkInDate: Date;
  checkOutDate: Date;
  currentSeason: string;
  isSpecialEvent: boolean;
  
}