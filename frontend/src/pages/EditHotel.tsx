import { useQuery } from "react-query";
import { useParams } from "react-router";
import * as apiClient from '../api-client';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';

const EditHotel = () => {
    // Get the hotelId from the URL parameters
    const { hotelId } = useParams();

    // Fetch the hotel data using react-query
    const { data: hotel, isLoading, isError } = useQuery(
        "fetchMyHotelById",
        // Function to fetch hotel data
        () => apiClient.fetchMyHotelById(hotelId || ''), // Pass hotelId only if it's defined
        // Conditionally enable the query based on the availability of hotelId
        {
            enabled: !!hotelId // Enable the query only if hotelId is defined
        }
    );

    // Render loading state while fetching data
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Render error message if there's an error fetching data
    if (isError) {
        return <div>Error fetching data</div>;
    }

    // Add check for hotel before passing to form
    if (hotel) {
        return <ManageHotelForm hotel={hotel} onSave={() => { }} isLoading={isLoading} />;
    } else {
        return <div>Hotel not found</div>;
    }
};


export default EditHotel;
