import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string // Make hotelId optional
    ) => void;
};

// Create a Search context and specify the type created above
// Default it to undefined so the first time the app loads it will be undefined
const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
};

// Define the variable for searching
export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>("");
    const [checkIn, setCheckIn] = useState<Date>(new Date());
    const [checkOut, setCheckOut] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState<number>(1);
    const [childCount, setChildCount] = useState<number>(0);
    const [hotelId, setHotelId] = useState<string>("");

    // Define the function to update the variable
    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date, 
        adultCount: number,
        childCount: number,
        hotelId?: string // Making  hotelId optional
    ) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setChildCount(childCount);
        setAdultCount(adultCount);
        if (hotelId) {
            setHotelId(hotelId);
        }
    };

    return (
        <SearchContext.Provider
            value={{
                destination,
                checkIn,
                checkOut,
                adultCount,
                childCount,
                hotelId,
                saveSearchValues,
            }}
        >
            {/* children variable comes from the prop in the provider component */}
            {children}
        </SearchContext.Provider>
    );
};

// Creating a hook for easy access to above properties
export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
};
