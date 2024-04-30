import { useQuery } from "react-query"; // Importing React Query hook for data fetching
import { useParams } from "react-router"; // Importing useParams hook for accessing URL parameters
import * as apiClient from './../api-client'; // Importing API client module
import { AiFillStar } from "react-icons/ai"; // Importing star icon component
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm"; // Importing guest info form component

const Detail = () => {
    const { hotelId } = useParams(); // Extracting hotelId from URL parameters using useParams hook

    // Fetching hotel data using useQuery hook from React Query
    const { data: hotel } = useQuery(
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

    // Render hotel details if hotel data is available
    return (
        <div className="space-y-6">
            {/* Hotel star rating section */}
            <div>
                <span className="flex">
                    {/* Render star icons based on hotel star rating */}
                    {hotel && Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar key={index} className="fill-orange-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotel?.name}</h1>
            </div>
    
            {/* Grid for displaying hotel images */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Map through image URLs and render images */}
                {hotel.imageUrls.map(image => (
                    <div key={image} className="h-[300px]">
                        <img
                            src={image}
                            alt={hotel.name}
                            className="rounded-md w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>
    
            {/* Grid for displaying hotel facilities */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Map through facilities and render */}
                {hotel?.facilities.map((facility, index) => (
                    <div key={index} className="border border-slate-300 p-2 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>

            {/* Section for displaying hotel description and guest info form */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr">
                {/* Render hotel description */}
                <div className="whitespace-pre-line">{hotel.description}</div>
                {/* Render guest info form */}
                <div className="h-fit">
                    <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id}/>
                </div>
            </div>
        </div>
    );
};

export default Detail; // Exporting the Detail component
