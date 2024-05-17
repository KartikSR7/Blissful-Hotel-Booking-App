import Hotel from "../models/hotel";


export type UserType = {
  _id: string;
  email: {
    type: string;
    minlength: 1; // Minimum length of 1 character
    maxlength: 20; // Maximum length of 20 characters
  };
  password: {
    type: string;
    minlength: 1; // Minimum length of 1 character
    maxlength: 15; // Maximum length of 15 characters
  };
  firstName: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
  };
  lastName: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
  };
  phoneNumber: {
    type: string;
    minlength: 1; // Minimum length of 1 character
    maxlength: 11; // Maximum length of 11 characters
  };
};

export type HotelType = {
  _id: string;
  userId: string;
  name: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
  };
  city: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
  };
  country: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
  };
  description: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 40; // Maximum length of 40 characters
  };
  type: {
    type: string;
    minlength: 1; // Minimum length of 1 character
    maxlength: 20; // Maximum length of 20 characters
  };
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: {
    type: number;
    min: 1; // Minimum value of 1
    max: 9999.999; // Maximum value of 9999.999
  };
  starRating: number;
  imageUrls: {
    type: string;
    minlength: 3; // Minimum length of 3 characters
    maxlength: 30; // Maximum length of 30 characters
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
    minlength: 1; // Minimum length of 1 digit
    maxlength: 3; // Maximum length of 3 digits
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