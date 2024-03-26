import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";
import * as apiClient from '../api-client';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';

const EditHotel = () => {
    // Get the hotelId from the URL parameters
    const { hotelId } = useParams();
    

    // Fetch the hotel data using react-query
    const { data: hotel } = useQuery(
        "fetchMyHotelById",
        // Function to fetch hotel data
        () => apiClient.fetchMyHotelById(hotelId || ''), // Pass hotelId only if it's defined
        // Conditionally enable the query based on the availability of hotelId
        {
            enabled: !!hotelId // Enable the query only if hotelId is defined
        }
    );

   // Define useMutation to update hotel data
   const { mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
        // Add logic for successx
    },
    onError: () => {
        // Add logic for error
    }
});

// Handle save action
const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData); // Call mutate function to update hotel data
};

return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />

};

export default EditHotel;