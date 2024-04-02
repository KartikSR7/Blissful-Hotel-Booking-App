import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../../contexts/SearchContext";
import { useAppContext } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router";

// Define the type for props
type Props = {
    hotelId: string; // Changed from String to string
    pricePerNight: number;
};

// Define the type for form data
type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
};

// Component definition
const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
    // Get search context
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Destructure useForm hook
    const {
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<GuestInfoFormData>({
        // Provide default values from search context
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount,
        },
    });

    // Watch(to track the value of form)checkIn and checkOut values
    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");

    // Define min and max dates for date picker
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    // Function to handle form submission for signed-in users
    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate(`/hotel/${hotelId}/booking`, { state: { from: location } });
    };

    // Function to handle form submission for guests not signed in
    const onSignInClick = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate("/sign-in", { state: { from: location } });
    };


    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">£{pricePerNight}/night</h3>
            <form onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}>
                <div className="grid grid-cols gap-4">
                    {/* Date picker for Check-in */}
                    <div>
                        <DatePicker
                            required
                            selected={checkIn}
                            onChange={(date) => setValue("checkIn", date as Date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none text-gray-900"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    {/* Date picker for Check-out */}
                    <div>
                        <DatePicker
                            required
                            selected={checkOut}
                            onChange={(date) => setValue("checkOut", date as Date)}
                            selectsEnd // Changed from selectsStart to selectsEnd
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-out Date" // Changed from "Check-in Date" to "Check-out Date"
                            className="min-w-full bg-white p-2 focus:outline-none text-gray-900"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    {/* Inputs for number of adults and children */}
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={1}
                                max={20}
                                {...register("adultCount", {
                                    required: "This field is required",
                                    min: {
                                        value: 1,
                                        message: "There must be at least one adult",
                                    },
                                    valueAsNumber: true,
                                })}
                            />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input
                                className="w-full p-1 focus:outline-none font-bold"
                                type="number"
                                min={0}
                                max={20}
                                {...register("childCount", {
                                    valueAsNumber: true,
                                })}
                            />
                        </label>
                        {/* Display error message for adult count if any */}
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">
                                {errors.adultCount.message}
                            </span>
                        )}
                    </div>

                    {/* Conditional rendering of button based on user authentication */}
                    {isLoggedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">Book Now</button>
                    ) : (
                        <button>Sign In</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GuestInfoForm;
