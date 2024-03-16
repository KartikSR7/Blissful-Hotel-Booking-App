"use strict";
// // Importing required modules
// import express, { Request, Response } from 'express'; // Importing express and types for Request and Response
// import cors from 'cors'; // Importing cors middleware
// import "dotenv/config"; // Importing dotenv for environment configuration
// import mongoose from 'mongoose';
// import userRoutes from './routes/users';   
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
// // Creating an instance of Express
// const app = express();
// // Middleware setup
// app.use(express.json()); // Parse incoming request bodies as JSON
// app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies as URL encoded data
// app.use(cors()); // Enable CORS for all routes
// app.use("/api/users", userRoutes)
// // Define a default route for testing purposes
// app.get('/api/test', async (req: Request, res: Response) => {
//     // Sending a JSON response
//     res.json({ message: 'Hello from the express endpoint' });
// });
// app.listen(5501, () =>{
//     console.log("server is running on loacalhost 5501")
// })
// Importing required modules
const express_1 = __importDefault(require("express")); // Importing express and types for Request and Response
const cors_1 = __importDefault(require("cors")); // Importing cors middleware
require("dotenv/config"); // Importing dotenv for environment configuration
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const uri = process.env.MONGODB_CONNECTION_STRING;
const options = {
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
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
//.then(() =>console.log("Connected tp database: ", process.env.MONGODB_CONNECTION_STRING));
// Creating an instance of Express
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Middleware setup
app.use(express_1.default.json()); // Parse incoming request bodies as JSON
app.use(express_1.default.urlencoded({ extended: true })); // Parse incoming request bodies as URL encoded data
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
})); // Enable CORS for all routes
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
// Define a default route for testing purposes
app.get('/api/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Sending a JSON response
    res.json({ message: 'Hello from the express endpoint' });
}));
app.listen(5501, () => {
    console.log("server is running on loacalhost 5501");
});
