// AppContext.tsx
import React, { useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Retrieved Stripe public key from environment variables
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Defined the structure of a toast message
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Define the structure of the AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};

// Created the AppContext
export const AppContext = React.createContext<AppContext | undefined>(undefined);

// Loaded Stripe with the provided public key
const stripePromise = loadStripe(STRIPE_PUB_KEY);

// AppContextProvider component to provide AppContext to its children
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  // State for managing toast messages
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  // Query to validate user token
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  // Render the context provider with value and toast component
  return (
    <AppContext.Provider
      value={{
        // Function to show toast messages
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        // Check if the user is logged in based on the token validation
        isLoggedIn: !isError,
        // Promise for Stripe
        stripePromise,
      }}
    >
      {/* Render the toast component if there's a toast message */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
      {/* Render children components */}
      {children}
    </AppContext.Provider>
  );
};
