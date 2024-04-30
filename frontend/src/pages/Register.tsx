import { useForm } from "react-hook-form"; // Import useForm from react-hook-form library for form management
import { useMutation, useQueryClient } from "react-query"; // Import useMutation from react-query library for managing mutations
import * as apiClient from '../api-client'; // Import apiClient module
//import { AppContext } from "../contexts/AppContext"; // Import useAppContext hook from AppContext
import { useNavigate } from "react-router";
import useAppContext from "../contexts/useAppContext";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext(); // Destructure showToast from AppContext

    // Destructure register, watch, handleSubmit, and errors from useForm hook
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    // Use useMutation hook to handle registration mutation
    const mutation = useMutation(apiClient.register, {
        onSuccess: async() => {
            showToast({ message: "Registration Successful", type: "SUCCESS" }); 
            await queryClient.invalidateQueries("validateToken");
            navigate("/");// Show success toast message
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" }); // Show error toast message
        },
    });

    // onSubmit function to handle form submission
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data); // Trigger registration mutation
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                {/* First Name input field */}
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName", { required: "This field is Required" })} />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                {/* Last Name input field */}
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("lastName", { required: "This field is Required" })} />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            {/* Email input field */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is Required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            {/* Password input field */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is Required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            {/* Confirm Password input field */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required";
                            } else if (watch("password") !== val) {
                                return "Passwords do not match";
                            }
                        }
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>
            {/* Submit button */}
            <span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue text-xl">
                    Create Account
                </button>
            </span>
        </form>
    );
};

export default Register;
