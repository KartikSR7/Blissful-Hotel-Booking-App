import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailSection"; // Import DetailSection component
import TypeSection from "./TypeSection"; // Import TypeSection component
import GuestsSection from "./GuestsSection"; // Import GuestsSection component
import FacilitiesSection from "./FacilitiesSection"; // Import FacilitiesSection component
import ImageSection from "./ImagesSection"; // Import ImagesSection component
import { HotelType } from "../../../../backend/src/shared/types"; // Import HotelType interface
import { useEffect } from "react";

// Define the type for form data
export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

// Define props for ManageHotelForm component
type Props = {
  hotel: HotelType;
  onSave: (hotelFormData: FormData) => void; // Function to handle saving form data
  isLoading: boolean; // Loading state
};

// Define ManageHotelForm component
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  // Initialize form methods using useForm hook
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  // Reset form when hotel prop changes
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  // Handle form submission
  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    // Append facilities to formData
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // Append imageFiles to formData
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });

    onSave(formData); // Call the onSave function with form data
  });

  return (
    // FormProvider to provide form methods to child components
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        {/* Include sections for different parts of the form */}
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImageSection />
        {/* Button to submit the form */}
        <span className="flex justify-end">
          <button
            disabled={isLoading} // Disable the button when loading
            type="submit"
            className="bg-blue-600 text-white p-3 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {/* Show "Saving..." text when isLoading is true, otherwise "Save" */}
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
