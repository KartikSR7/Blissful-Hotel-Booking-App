"use strict";
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
// Import the necessary modules from the "express" and "express-validator" libraries
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user")); // Assuming this is a local file importing a User model
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
// Create an Express router
const router = express_1.default.Router();
// Define a route for user registration
router.post("/register", [
    // Validate user registration data using express-validator
    (0, express_validator_1.check)("firstName", "First Name is required").isString(),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString(),
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        // Check if a user with the provided email already exists
        let user = yield user_1.default.findOne({ email: req.body.email });
        // If user already exists, respond with an error
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create a new user instance with the provided data
        user = new user_1.default(req.body);
        // Save the new user to the database
        yield user.save();
        // Create a JSON Web Token (JWT) for authentication
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        // Set the JWT as a cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000, // 1 day
        });
        // Respond with a success message
        return res.status(200).send({ message: "User registered successfully" });
    }
    catch (error) {
        // If an error occurs, log it and respond with a generic error message
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
}));
// Export the router
exports.default = router;
