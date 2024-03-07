import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "/Users/kartiksally/Desktop/Blissful-Hotel-Booking-App/frontend/src/api-client.ts";
import { useQuery } from "react-query"; // Import useQuery from react-query

// Define type for the toast message
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

// Define type for the application context
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
}

// Create a context object with initial value undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Provider component for the application context
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    // State to manage the toast message
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    // Retrieve the isError value from useQuery hook
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });
    
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => { setToast(toastMessage); },
            isLoggedIn: !isError
        }}>
            {/* Render the Toast component if toast message exists */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />}
            {/* Render children */}
            {children}
        </AppContext.Provider>
    );
};

// Hook to use the application context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    // Retrieve the context value
    const context = useContext(AppContext);
    
    return context as AppContext;
};
