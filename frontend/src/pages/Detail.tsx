import { useQuery } from "react-query"; // Importing React Query hook for data fetching
import { useParams } from "react-router"; // Importing useParams hook for accessing URL parameters
import * as apiClient from './../api-client'; // Importing API client module
import { AiFillStar } from "react-icons/ai"; // Importing star icon component
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm"; // Importing guest info form component
import { HotelType } from "../../../backend/src/shared/types";
//import { HotelType } from "../types"; // Importing HotelType

const Detail = () => {
    const { hotelId } = useParams<{ hotelId: string }>(); // Extracting hotelId from URL parameters using useParams hook

    // Fetching hotel data using useQuery hook from React Query
    const { data: hotel } = useQuery<HotelType>(
        "fetchHotelById", // Query key
        () => apiClient.fetchHotelById(hotelId as string), // Fetching hotel data by ID using API client
        {
            enabled: !!hotelId, // Enabling query only when hotelId is available
        }
    );

    // If hotel data is not available yet, return empty fragment
    if (!hotel) {
        return <></>;
    }

    // Helper function to safely access nested properties
    const getProperty = <T,>(property: T | { type: T }): T => {
        return (property as { type: T }).type ?? (property as T);
    };

    // Safely accessing hotel properties
    const hotelName = getProperty(hotel.name);
    const hotelDescription = getProperty(hotel.description);
    const hotelPricePerNight = getProperty(hotel.pricePerNight);
    const hotelStarRating = getProperty(hotel.starRating);
    const hotelImageUrls = getProperty(hotel.imageUrls);
    const hotelFacilities = getProperty(hotel.facilities);

    // Render hotel details if hotel data is available
    return (
        <div className="space-y-6">
            {/* Hotel star rating section */}
            <div>
                <span className="flex">
                    {/* Render star icons based on hotel star rating */}
                    {hotelStarRating && Array.from({ length: hotelStarRating }).map((_, index) => (
                        <AiFillStar key={index} className="fill-orange-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotelName}</h1>
            </div>

            {/* Grid for displaying hotel images */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Map through image URLs and render images */}
                import React from 'react';

                {hotelImageUrls.map((image, index) => (
                    <div key={index} className="h-[300px]">
                        <img
                            src={`${image}`}
                            alt={hotelName}
                            className="rounded-md w-full h-full object-cover object-center"
                        />
                    </div>
                ))}

            </div>

            {/* Grid for displaying hotel facilities */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Map through facilities and render */}
                {hotelFacilities.map((facility, index) => (
                    <div key={index} className="border border-slate-300 p-2 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>

            {/* Section for displaying hotel description and guest info form */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                {/* Render hotel description */}
                <div className="whitespace-pre-line">{hotelDescription}</div>
                {/* Render guest info form */}
                <div className="h-fit">
                    <GuestInfoForm pricePerNight={hotelPricePerNight} hotelId={hotel._id} />
                </div>
            </div>
        </div>
    );
};

export default Detail; // Exporting the Detail component
