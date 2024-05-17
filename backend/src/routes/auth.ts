// Import the necessary modules from the "express" and "express-validator" libraries, as well as from local files
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user"; // Assuming this is a local file importing a User model
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import verifyToken from "../middleware/auth"; // Assuming this is a local middleware for verifying tokens

// Create an Express router
const router = express.Router();

// Define a route for user login
router.post("/login", [
    // Validate email and password using express-validator
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    };

    // Destructure email and password from request body
    const { email, password } = req.body;

    try {
        // Find the user by email in the database
        const user = await User.findOne({ email });

        // If user not found, respond with an error
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare provided password with the stored hashed password
        type PasswordObject = { type: string; minlength: number; maxlength: number };
        type PasswordString = string;

       function isPasswordObject(password: PasswordObject | PasswordString): password is PasswordObject {
       return typeof password !== 'string';
}

const isMatch = await bcrypt.compare(
  password,
  isPasswordObject(user.password) ? user.password.type : user.password
);

        // If passwords don't match, respond with an error
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

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

        // Respond with the user's ID
        res.status(200).json({ userId: user._id });

    } catch (error) {
        // If an error occurs, log it and respond with a generic error message
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Define a route for validating the authentication token
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    // Respond with the user's ID extracted from the token
    res.sendStatus(200).send({ userId: req.userId });
});

// Define a route for user logout
router.post("/logout", (req: Request, res: Response) => {
    // Clear the authentication token cookie
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
    // Respond with a message indicating successful logout
   
    // res.status(200).send({ message: "User logged out successfully" });
});

// Export the router
export default router;
