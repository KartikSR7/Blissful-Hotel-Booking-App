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
    const [destination, setDestination] = useState<string>(
        ()=>  sessionStorage.getItem('destination') || "");
     //(|| '' to pass an empty string if there is empty value is session storage)
    const [checkIn, setCheckIn] = useState<Date>(new Date( sessionStorage.getItem("checkIn") || new Date().toISOString()));
    const [checkOut, setCheckOut] = useState<Date>(new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));
    const [adultCount, setAdultCount] = useState<number>(()=>parseInt(sessionStorage.getItem("adultCount") || "1"));
    const [childCount, setChildCount] = useState<number>(()=>parseInt(sessionStorage.getItem("childCount") || "1"));
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelId") || ""
    );

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

        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());

        if(hotelId){
            sessionStorage.setItem("hotelId", hotelId);
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
