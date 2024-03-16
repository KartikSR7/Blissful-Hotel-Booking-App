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
// Import the necessary modules from the "express" and "express-validator" libraries, as well as from local files
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user")); // Assuming this is a local file importing a User model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth")); // Assuming this is a local middleware for verifying tokens
// Create an Express router
const router = express_1.default.Router();
// Define a route for user login
router.post("/login", [
    // Validate email and password using express-validator
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    // Destructure email and password from request body
    const { email, password } = req.body;
    try {
        // Find the user by email in the database
        const user = yield user_1.default.findOne({ email });
        // If user not found, respond with an error
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare provided password with the stored hashed password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // If passwords don't match, respond with an error
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
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
        // Respond with the user's ID
        res.status(200).json({ userId: user._id });
    }
    catch (error) {
        // If an error occurs, log it and respond with a generic error message
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Define a route for validating the authentication token
router.get("/validate-token", auth_1.default, (req, res) => {
    // Respond with the user's ID extracted from the token
    res.sendStatus(200).send({ userId: req.userId });
});
// Define a route for user logout
router.post("/logout", (req, res) => {
    // Clear the authentication token cookie
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
    // Respond with a message indicating successful logout
    // res.status(200).send({ message: "User logged out successfully" });
});
// Export the router
exports.default = router;
