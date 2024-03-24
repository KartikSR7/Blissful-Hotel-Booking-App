import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from '../api-client';

const AddHotel = () => {
    // Access showToast function from AppContext
    const { showToast } = useAppContext();

    // Define mutation function to add hotel
    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        // onSuccess callback function to handle successful mutation  
        onSuccess: () => {
            showToast({ message: "Hotel Saved", type: "SUCCESS" });
        },
        // onError callback function to handle mutation error
        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
    });

    // Function to handle saving hotel data
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData); // Call the mutate function with hotelFormData
    };

    // Render ManageHotelForm component with onSave and isLoading props
    return <ManageHotelForm onSave={handleSave} isLoading={isLoading} hotel={{
        userId: "",
        name: "",
        city: "",
        country: "",
        description: "",
        type: "",
        adultCount: 0,
        childCount: 0,
        facilities: [],
        pricePerNight: 0,
        starRating: 0,
        imageUrls: [],
        lastUpdated: new Date(),
        newProperty: ""
    }} />;
};


export default AddHotel;
