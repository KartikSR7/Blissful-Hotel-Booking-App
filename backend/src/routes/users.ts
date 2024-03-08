 // Import the necessary modules from the "express" and "express-validator" libraries
import express, { Request, Response } from "express";
import User from "../models/user"; // Assuming this is a local file importing a User model
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

// Create an Express router
const router = express.Router();

// Define a route for user registration
router.post("/register", [
    // Validate user registration data using express-validator
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    try {
        // Check if a user with the provided email already exists
        let user = await User.findOne({ email: req.body.email });

        // If user already exists, respond with an error
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user instance with the provided data
        user = new User(req.body);

        // Save the new user to the database
        await user.save();

        // Create a JSON Web Token (JWT) for authentication
        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET_KEY as string, {
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
    } catch (error) {
        // If an error occurs, log it and respond with a generic error message
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

// Export the router
export default router;
