import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from '../api-client';
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { HotelType } from "../../../backend/src/shared/types";
//import { HotelType } from "../types"; // Importing HotelType

const MyHotels = () => {
    // Fetching hotel data using react-query
    const { data: hotelData } = useQuery<HotelType[]>(
        "fetchMyHotels", // Query key
        apiClient.fetchMyHotels, // Fetch function
        {
            onError: () => {} // Error handling function
        }
    );

    if (!hotelData) {
        return <span>No Hotels found</span>;
    }

    // Helper function to safely access nested properties
    const getProperty = <T,>(property: T | { type: T }): T => {
        return (property as { type: T }).type ?? (property as T);
    };

    // Rendering JSX
    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-3xl font-bold">My Hotels</h1>
                {/* Link to Add Hotel page */}
                <Link to="add-hotel" className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500">
                    Add Hotel
                </Link>
            </div>
            {/* Displaying hotel data */}
            <div className="grid grid-cols-1 gap-8">
                {/* Mapping through hotelData and rendering hotel details */}
                {hotelData.map((hotel) => {
                    const hotelName = getProperty(hotel.name);
                    const hotelDescription = getProperty(hotel.description);
                    const hotelCity = getProperty(hotel.city);
                    const hotelCountry = getProperty(hotel.country);
                    const hotelType = getProperty(hotel.type);
                    const hotelPricePerNight = getProperty(hotel.pricePerNight);
                    const hotelStarRating = getProperty(hotel.starRating);

                    return (
                        <div key={hotel._id} className="flex flex-col justify-between border-slate-300 rounded-lg p-8 gap-5">
                            <h2 className="text-2xl font-bold">{hotelName}</h2>
                            <div className="whitespace-pre-line">Description: {hotelDescription}</div>
                            <div className="grid grid-cols-5 gap-2">
                                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                    <BsMap className="mr-1" />
                                    {hotelCity}, {hotelCountry}
                                </div>
                                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                    <BsBuilding className="mr-1" />
                                    {hotelType}
                                </div>
                                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                    <BiMoney className="mr-1" />
                                    £{hotelPricePerNight} per night
                                </div>
                                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                    <BiHotel className="mr-1" />
                                    {hotel.adultCount} adults, {hotel.childCount} children
                                </div>
                                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                    <BiStar className="mr-1" />
                                    {hotelStarRating} Star Rating
                                </div>
                            </div>
                            <span className="flex justify-end">
                                <Link
                                    className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                                    to={`/edit-hotel/${hotel._id}`}
                                >
                                    View Details
                                </Link>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyHotels;
