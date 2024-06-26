import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from '../api-client';
import useAppContext from "../contexts/useAppContext";

const AddHotel = () => {
    // Access showToast function from AppContext
    const { showToast } = useAppContext();

    // Define mutation function to add hotelh
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
    return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
