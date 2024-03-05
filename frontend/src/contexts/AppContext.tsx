import React, { useContext, useState } from "react";
import Toast from "../components/Toast";

// Define type for the toast message
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

// Define type for the application context
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
}

// Create a context object with initial value undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Provider component for the application context
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    // State to manage the toast message
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => { setToast(toastMessage); }
        }}>
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
    
    return context as AppContext;
};
