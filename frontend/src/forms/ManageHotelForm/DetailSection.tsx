import { useFormContext } from "react-hook-form"; // Importing useFormContext hook from react-hook-form library
import { HotelFormData } from "./ManageHotelForm"; // Importing HotelFormData type from ManageHotelForm module

// HotelDetailsSection component
const DetailsSection = () => {
    // Destructuring useFormContext hook to get register and errors from form context
    const { register, formState: { errors } } = useFormContext<HotelFormData>();

    // JSX representing hotel details section
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
            {/* Input for Name */}
            <label className="block text-gray-700 text-sm font-bold mb-2 flex-1" htmlFor="name">
                Name
                <input
                    type="text"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    {...register("name", { required: "This field is Required" })}
                />
                {/* Display error message if name validation fails */}
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
            </label>
            <div className="flex gap-4">
                {/* Input for City */}
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1" htmlFor="city">
                    City
                    <input
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        {...register("city", { required: "This field is Required" })}
                    />
                    {/* Display error message if city validation fails */}
                    {errors.city && (
                        <span className="text-red-500">{errors.city.message}</span>
                    )}
                </label>
                {/* Input for Country */}
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1" htmlFor="country">
                    Country
                    <input
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        {...register("country", { required: "This field is Required" })}
                    />
                    {/* Display error message if country validation fails */}
                    {errors.country && (
                        <span className="text-red-500">{errors.country.message}</span>
                    )}
                </label>
            </div>
            {/* Textarea for Description */}
            <label className="block text-gray-700 text-sm font-bold mb-2 flex-1">
                Description
                <textarea
                    rows={10}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    {...register("description", { required: "This field is Required" })}
                ></textarea>
                {/* Display error message if description validation fails */}
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </label>
            <div className="flex gap-4">
                {/* Input for Price Per Night */}
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1 max-w-[50%]">
                    Price Per Night
                    <input
                        type="number"
                        min={1}
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        {...register("pricePerNight", { required: "This field is Required" })}
                    />
                    {/* Display error message if pricePerNight validation fails */}
                    {errors.pricePerNight && (
                        <span className="text-red-500">{errors.pricePerNight.message}</span>
                    )}
                </label>
                {/* Input for Star Rating */}
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1 max-w-[50%]">
                    Star Rating
                    <select
                        {...register("starRating", { required: "This field is Required" })}
                        className="border rounded w-full p-2 text-gray-700 font-normal"
                    >
                        <option value="" className="text-sm font-bold">
                            Select a Rating
                        </option>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    {/* Display error message if starRating validation fails */}
                    {errors.starRating && (
                        <span className="text-red-500">{errors.starRating.message}</span>
                    )}
                </label>
            </div>
        </div>
    );
};

export default DetailsSection; // Exporting HotelDetailsSection component
