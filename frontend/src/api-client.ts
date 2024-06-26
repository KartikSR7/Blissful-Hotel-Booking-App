// Importing types
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from '../../backend/src/shared/types';
import { BookingFormData } from "./forms/ManageHotelForm/BookingForm/BookingForm";

// Retrieving API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser= async(): Promise<UserType> =>{
    const response = await fetch(`${API_BASE_URL}api/users/`,
    {credentials: "include"}

    )
    if(!response.ok){
        throw new Error("Could not get current user data");
    }
    return response.json();
}

// Function to register a user
export const register = async (formData: RegisterFormData) => {
    // Sending a POST request to register a user
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    // Parsing response body

    const responseBody = await response.json();

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

// Function to sign in a user
export const signIn = async (formData: SignInFormData) => {
    // Sending a POST request to sign in a user
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    // Parsing response body
    const body = await response.json();

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error(body.message);
    }

    return body;
};

// Function to validate user token
export const validateToken = async () => {
    // Sending a GET request to validate user token
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: "POST",
        credentials: "include"
    });

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
};

// Function to sign out
export const signOut = async () => {
    // Sending a POST request to sign out
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    });

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error("Logout failed");
    }
};

// Function to add a hotel
export const addMyHotel = async (hotelFormData: FormData) => {
    // Sending a POST request to add a hotel
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error("Failed to add hotel");
    }

    return response.json();
};

// Function to fetch user's hotels
export const fetchMyHotels = async (): Promise<HotelType[]> => {
    // Sending a GET request to fetch user's hotels
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    });

    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    return response.json();
};

export const fetchMyHotelById = async (hotelId: string) : Promise<HotelType> => {
    // Sending a GET request to fetch user's hotel by ID
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include",
    });
    
    // Handling errors if response is not OK
    if (!response.ok) {
        throw new Error("Failed to fetch hotel");
    }

    return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
      {
        method: "PUT",
        body: hotelFormData,
        credentials: "include",
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to update Hotel");
    }
  
    return response.json();
  };
  

export type SearchParams = {

    destination?: string
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOptions?: string;

};

export const searchHotels = async (searchParams: SearchParams): 
Promise<HotelSearchResponse>=>{
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "")
    queryParams.append("sortOPtion", searchParams.sortOptions|| "");

    searchParams.facilities?.forEach((facility)=>
     queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type)=> queryParams.append("types", type));
    searchParams.stars?.forEach((star)=> queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`
    );

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }
        return response.json();
    
};

export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);
    if(!response.ok){
        throw new Error("Error fetching hotels")
    }

    return response.json();

};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch hotel");
    }
    return response.json();
};

export const createPaymentIntent = async (
    hotelId: string, 
    numberOfNights: string
): Promise<PaymentIntentResponse>=> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ numberOfNights }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching payment intent");
        }

        return response.json();
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new Error("Something went wrong while creating payment intent");
    }
};

export const createRoomBoooking = async( formData: BookingFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
        method: 'POST',
        headers:{
            "Content - Type":"application/json",
            
        },
        credentials: "include",
        body:JSON.stringify(formData),
    }
    );
    if(!response.ok){
        throw new Error("Error booking room");
    }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to fetch bookings");
    }

    return response.json();
};