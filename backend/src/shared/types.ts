import Hotel from "../models/hotel";

export type UserType = {
  _id: string;
  email: string;
  password: {
    type: string;
    minlength: 1;
    maxlength: 15;
  };
  firstName: string;
  lastName: string;
  phoneNumber: {
    type: string;
    minlength: 1;
    maxlength: 11;
  };
};

export type HotelType = {
  _id: string;
  userId: string;
  name: {
    type: string;
    minlength: 3;
    maxlength: 30;
  };
  city: {
    type: string;
    minlength: 3;
    maxlength: 30;
  };
  country: {
    type: string;
    minlength: 3;
    maxlength: 30;
  };
  description: {
    type: string;
    minlength: 3;
    maxlength: 40;
  };
  type: {
    type: string;
    minlength: 1;
    maxlength: 20;
  };
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: {
    type: number;
    min: 1;
    max: 9999.999;
  };
  starRating: number;
  imageUrls: {
    type: string;
    minlength: 3;
    maxlength: 30;
  }[];
  lastUpdated: Date;
  newProperty: string;
  bookings: BookingType[];
};

export type BookingType = {
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
  cvv: {
    type: number;
    minlength: 1;
    maxlength: 3;
  };
};
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