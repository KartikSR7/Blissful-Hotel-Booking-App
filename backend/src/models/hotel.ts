import mongoose, { Schema, Document } from "mongoose";
import { BookingType, HotelType } from "../shared/types";

// Define the schema for the Booking document
const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
  totalCost: { type: Number, required: true },
});

// Define the schema for the Hotel document
const hotelSchema: Schema<HotelType & Document> = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  newProperty: { type: String },
  // Linked booking schema here to hotel schema above
  bookings: [bookingSchema],
});

// Define the Hotel model
const Hotel = mongoose.model<HotelType & Document>("Hotel", hotelSchema);

export default Hotel;
