import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export type SignInFormData ={
  email: string;
  password: string;
}

const SignIn = () => {
    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({message: "Signed in successfully", type: "SUCCESS"});
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold mb-8">Sign In</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex-1" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    {...register("email", { required: "This field is Required" })}
                />
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
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm">
                    Not registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-600 text-white p-3 font-bold rounded-lg hover:bg-blue-700 text-xl">
                    Log In
                </button>
            </div>
        </form>
    );
};

export default SignIn;
