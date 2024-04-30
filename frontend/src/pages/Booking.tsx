// Import necessary libraries and components
import { useQuery } from "react-query"; // Import useQuery hook from react-query
import * as apiClient from "../api-client"; // Import API client functions
import BookingForm from "../forms/ManageHotelForm/BookingForm/BookingForm"; // Import BookingForm component
import { useParams } from "react-router"; // Import useParams hook from react-router
import { useEffect, useState } from "react"; // Import useEffect and useState hooks from React
import BookingDetailSummary from "../components/BookingDetailsSummary"; // Import BookingDetailSummary component
import { Elements } from "@stripe/react-stripe-js"; // Import Elements component from react-stripe-js
import { useSearchContext } from "../contexts/useSearchContext"; // Import useSearchContext hook from custom context
import { useAppContext } from "../contexts/useAppContext"; // Import useAppContext hook from custom context

// Define Booking component
const Booking = () => {
    // Access stripePromise from AppContextProvider using useAppContext hook
    const { stripePromise } = useAppContext();
    // Access search context using useSearchContext hook
    const search = useSearchContext();
    // Get hotelId from URL params
    const { hotelId } = useParams();

    // State to store number of nights
    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    // Calculate number of nights when check-in or check-out dates change
    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);
            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    // Fetch payment intent data using useQuery hook
    const { data: paymentIntentData } = useQuery("createpaymentIntent", () =>
        apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()),
        {
            enabled: !!hotelId && numberOfNights > 0,
        });

    // Fetch hotel data using useQuery hook
    const { data: hotel } = useQuery(
        "fetchHotelByID",
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        });

    // Fetch current user data using useQuery hook
    const { data: currentUser } = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    );

    // If hotel data is not yet available, return an empty fragment
    if (!hotel) {
        return <></>;
    }

    // Log current user's email to console (if available)
    console.log(currentUser?.email);

    // Render BookingDetailSummary and BookingForm components
    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            {/* Render BookingDetailSummary component */}
            <BookingDetailSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel} />
            <div className="bg-green-200">BOOKING DETAILS SUMMARY</div>
            {/* Render BookingForm component if currentUser and paymentIntentData are available */}
            {currentUser && paymentIntentData && (
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret
                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements>
            )}
        </div>
    );
};

// Export Booking component
export default Booking;
