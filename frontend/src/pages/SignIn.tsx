import { useForm } from "react-hook-form"; // Importing useForm hook from react-hook-form library
import { useMutation, useQueryClient } from "react-query"; // Importing useMutation and useQueryClient hooks from react-query library
import * as apiClient from '../api-client'; // Importing apiClient module
import { useAppContext } from "../contexts/AppContext"; // Importing useAppContext hook from AppContext context
import { useNavigate } from "react-router"; // Importing useNavigate hook from react-router library
import { Link } from "react-router-dom"; // Importing Link component from react-router-dom library

// Defining type for form data
export type SignInFormData = {
  email: string;
  password: string;
}

// SignIn component
const SignIn = () => {
    // Using useAppContext hook to get showToast function
    const { showToast } = useAppContext();
    // Using useNavigate hook to get navigation function
    const navigate = useNavigate();
    // Using useQueryClient hook to get queryClient instance
    const queryClient = useQueryClient();

    // Destructuring useForm hook to get register, errors, and handleSubmit functions
    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

    // Using useMutation hook to perform sign-in mutation
    const mutation = useMutation(apiClient.signIn, {
        // onSuccess callback to handle successful sign-in
        onSuccess: async () => {
            // Show success toast
            showToast({ message: "Signed in successfully", type: "SUCCESS" });
            // Invalidate the "validateToken" query
            await queryClient.invalidateQueries("validateToken");
            // Navigate to home page
            navigate("/");
        },
        // onError callback to handle sign-in error
        onError: (error: Error) => {
            // Show error toast with error message
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    // Function to handle form submission
    const onSubmit = handleSubmit((data) => {
        // Trigger sign-in mutation with form data
        mutation.mutate(data);
    });

    // JSX representing sign-in form
    return (
        <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold mb-8">Sign In</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1" htmlFor="email">
                    Email
                    <input
                        id="email"
                        type="email"
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        {...register("email", { required: "This field is Required" })}
                    />
                </label>
                {/* Display error message if email validation fails */}
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    {...register("password", {
                        required: "This field is Required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />
                {/* Display error message if password validation fails */}
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm">
                    Not registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>
                {/* Button to submit the form */}
                <button type="submit" className="bg-blue-600 text-white p-3 font-bold rounded-lg hover:bg-blue-700 text-xl">
                    Log In
                </button>
            </div>
        </form>
    );
};

export default SignIn; // Exporting SignIn component
