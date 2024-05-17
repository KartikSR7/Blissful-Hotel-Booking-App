

// Importing required modules
import express, { Request, Response } from 'express'; // Importing express and types for Request and Response
import cors from 'cors'; // Importing cors middleware
import "dotenv/config"; // Importing dotenv for environment configuration
import mongoose, { ConnectOptions } from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from"cookie-parser";
import path from 'path';
import {v2 as cloudinary } from 'cloudinary';
import myHotelRoutes from './routes/my-hotels';
import hotelRoutes from "./routes/hotels";
import  bookingRoutes from "./routes/my-bookings";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uri = process.env.MONGODB_CONNECTION_STRING as string;

const options: ConnectOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // Add the SSL-related properties
  ssl: true,
  //sslValidate: false, // Disable SSL certificate validation
};

// mongoose.connect(uri, options).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((error) => {
//   console.log('Error connecting to MongoDB:', error)
//   sslvalidate: false;
// });
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
//.then(() =>console.log("Connected tp database: ", process.env.MONGODB_CONNECTION_STRING));

// Creating an instance of Express
const app = express();
app.use(cookieParser());
// Middleware setup
app.use(express.json()); // Parse incoming request bodies as JSON
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies as URL encoded data
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials : true,
})); // Enable CORS for all routes

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response)=>{
    res.sendFile(path.join(__dirname + "/../../frontend/dist/index.html"));
});

// Define a default route for testing purposes
app.get('/api/test', async (req: Request, res: Response) => {
    // Sending a JSON response
    res.json({ message: 'Hello from the express endpoint' });
});

app.listen(5501, () =>{
    console.log("server is running on loacalhost 5501")
})
