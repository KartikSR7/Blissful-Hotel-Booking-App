import { SubmitHandler, useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from '/Users/kartiksally/Desktop/Blissful-Hotel-Booking-App/frontend/src/api-client.ts';
import { useAppContext } from "../../../contexts/useAppContext";
import { useSearchContext } from "../../../contexts/useSearchContext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const search = useSearchContext();
    const { showToast } = useAppContext();

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBoooking, {
        onSuccess: () => {
            showToast({ message: "Booking Saved!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Error saving booking", type: "ERROR" });
        },
    });

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: useParams().hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId
        }
    });

    const onSubmit: SubmitHandler<BookingFormData> = async (formData) => {
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement
            }
        });

        if (result.paymentIntent?.status === "succeeded") {
            bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
        >
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        value={currentUser.firstName}
                        {...register("firstName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        value={currentUser.lastName}
                        {...register("lastName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        value={currentUser.email}
                        {...register("email")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Adult Count
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
                        type="number"
                        readOnly
                        disabled
                        value={search.adultCount}
                        {...register("adultCount", { valueAsNumber: true })}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Child Count
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
                        type="number"
                        readOnly
                        disabled
                        value={search.childCount}
                        {...register("childCount", { valueAsNumber: true })}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold"> Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: £{paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Includes taxes and booking fees.</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Payment Details</h3>
                <CardElement id="payment-element" className="border rounded-md p-2 text-sm" />
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>
        </form>
    );
};

export default BookingForm;