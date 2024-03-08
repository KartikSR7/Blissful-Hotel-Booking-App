// Import the `useForm` hook from the "react-hook-form" library
import { useForm } from "react-hook-form";

// Import the `useMutation` hook from the "react-query" library
import { useMutation, useQueryClient } from "react-query";

// Import all exports from the "../api-client" file and alias it as `apiClient`
import * as apiClient from '../api-client';

// Import the `useAppContext` and `useNavigate` hooks from their respective libraries
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router";

// Define a type for the form data expected in the sign-in form
export type SignInFormData ={
  email: string;
  password: string;
}

// Define the `SignIn` component
const SignIn = () => {
    // Retrieve `showToast` function from the application context
    const {showToast} = useAppContext();
    // Initialize the `navigate` function for redirecting users
    const navigate = useNavigate();
    const queryClient = useQueryClient();

  // Destructure the `register` function and `errors` from the result of `useForm` hook
  const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

  // Use the `useMutation` hook to handle mutation logic
  const mutation = useMutation(apiClient.signIn, {
    // Action to perform when mutation succeeds
    onSuccess: () => {
      // Display a success toast message and navigate to the home page
      showToast({message: "Signed in successfully", type: "SUCCESS"});
      await queryClient.invalidateQueries("validateToken");

      navigate("/");
    },
    // Action to perform when mutation fails
    onError: (error: Error) => {
      // Handle error, e.g., show a toast with the error message
      showToast({message: error.message, type: "ERROR"});
    },
  });

  // Define a callback function for form submission
  const onSubmit = handleSubmit((data) => {
    // Execute the mutation with form data
    mutation.mutate(data);
  });

  // Render the sign-in form
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {/* Title */}
      <h2 className="text-3xl font-bold">Sign In</h2>
      {/* Email input field */}
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is Required" })}
        />
        {/* Display error message if email validation fails */}
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
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {/* Display error message if password validation fails */}
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      {/* Submit button */}
      <span>
        <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue text-xl">
          Log In
        </button>
      </span>
    </form>
  );
};

// Export the `SignIn` component as default
export default SignIn;
