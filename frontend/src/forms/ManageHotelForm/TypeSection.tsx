import { hotelTypes } from '../../config/hotel-options-config'; // Importing hotelTypes from hotel-options-config file
import { useFormContext } from 'react-hook-form'; // Importing useFormContext hook from react-hook-form library

const TypeSection = () => {
    const { register } = useFormContext(); // Destructuring register from useFormContext

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Type</h2>
            <div className="grid grid-cols-5 gap-2">
                {/* Mapping through hotelTypes array to render radio buttons */}
                {hotelTypes.map((type ) => (
                    <label>
                        <input
                            type="radio"
                            value={type}
                            {...register("type", {
                                required: "This field is required"
                            })}
                        />
                        <span>
                            {type}
                        </span>

                    </label>
                ))}
            </div>
        </div>
    );
};

export default TypeSection;
