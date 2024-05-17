// Importing mongoose for database interaction
import mongoose from "mongoose";
// Importing bcrypt for password hashing
import bcrypt from "bcryptjs";
// Importing UserType type definition
import { UserType } from "../shared/types";

// Defining the user schema with mongoose
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Email field, required and must be unique
    password: { type: String, required: true }, // Password field, required
    firstName: { type: String, required: true }, // First name field, required
    lastName: { type: String, required: true }, // Last name field, required
    phoneNumber: { type: String, required: false }, // Phone number field, optional
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function(next){
    // Check if the password field is modified
    if(this.isModified('password')){
        // Hash the password
        this.password = await bcrypt.hash(this.password, 8);
    }
    // Call the next middleware
    next();
});

// Creating the User model from the schema and specifying the UserType type definition
const User = mongoose.model<UserType>("User", userSchema);

// Exporting the User model for use in other parts of the application
export default User;
