import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "../api-client"; // Corrected import statement
import { useQuery } from "react-query"; // Corrected import statement
import { loadStripe , Stripe} from "@stripe/stripe-js"; // Corrected import statement

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Define type for the toast message
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Define type for the application context
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};

// Create a context object with initial value undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Provider component for the application context
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  // State to manage the toast message
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  // Retrieve the isError value from useQuery hook
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise, // Corrected property assignment
      }}
    >
      {/* Render the Toast component if toast message exists */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
      {/* Render children */}
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the application context
export const useAppContext = () => {
  // Retrieve the context value
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};