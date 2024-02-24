// Importing required modules
import express, { Request, Response } from 'express'; // Importing express and types for Request and Response
import cors from 'cors'; // Importing cors middleware
import "dotenv/config"; // Importing dotenv for environment configuration
import mongoose from 'mongoose';
import userRoutes from './routes/users';   

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

// Creating an instance of Express
const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming request bodies as JSON
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies as URL encoded data
app.use(cors()); // Enable CORS for all routes

app.use("/api/users", userRoutes)

// Define a default route for testing purposes
app.get('/api/test', async (req: Request, res: Response) => {
    // Sending a JSON response
    res.json({ message: 'Hello from the express endpoint' });
});

app.listen(5501, () =>{
    console.log("server is running on loacvlhost 5501")
})