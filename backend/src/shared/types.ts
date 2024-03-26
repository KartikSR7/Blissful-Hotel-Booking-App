export type HotelType = {
    _id(arg0: string, _id: any): unknown;
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
    newProperty: string; // Corrected the type from String to string
  }