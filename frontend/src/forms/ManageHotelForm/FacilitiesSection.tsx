// Importing the necessary hooks and components from external modules
import { useFormContext } from "react-hook-form"; // Importing useFormContext hook from react-hook-form
import { hotelFacilities } from "../../config/hotel-options-config"; // Importing hotelFacilities from a config file
import { HotelFormData } from "./ManageHotelForm"; // Importing HotelFormData from another file

// Functional component for FacilitiesSection
const FacilitiesSection = () => {
    // Destructuring useFormContext to get register and errors from the form context
    const { register, formState: { errors } } = useFormContext<HotelFormData>(); 

    // Rendering the component
    return(
        <div>
            {/* Heading for the Facilities section */}
            <h2 className="text-2xl font-bold mb-3">Facilities</h2>
            {/* Grid layout for checkboxes */}
            <div className="grid grid-cols-5 gap-3">
                {/* Mapping over hotelFacilities array to render checkboxes */}
                {hotelFacilities.map((facility, index) =>  (
                    <label key={index} className="text-sm flex gap-1 text-gray-700">
                        {/* Checkbox input */}
                        <input 
                            type="checkbox" 
                            value={facility} 
                            {...register("facilities", { // Registering each checkbox with React Hook Form
                                validate: (facilities) => { // Validation function
                                    if(facilities && facilities.length > 0) {
                                        return true; // Return true if at least one facility is selected
                                    } else {
                                        return "At least one facility must be selected"; // Error message if no facility is selected
                                    }
                                }
                            })}
                        />
                        {/* Displaying the facility name */}
                        {facility}
                    </label>
                ))}
            </div>
            {errors.facilities &&(
                <span className ="text-red-500 text-sm font-bold">
                    {errors.facilities.message}</span>
            )}
        </div>
    );
};

// Exporting the FacilitiesSection component as default
export default FacilitiesSection;
