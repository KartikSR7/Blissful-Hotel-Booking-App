import React, { useState } from "react"; // Import React
import { useSearchContext } from "../contexts/SearchContext"; // Import useSearchContext from SearchContext
import { MdTravelExplore } from "react-icons/md"; // Import MdTravelExplore icon from react-icons/md package
import  DatePicker from  "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css"
import { useNavigate } from "react-router";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext(); // Use the useSearchContext hook to access search context

    // Initialize state variables with values from search context
    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);


    // Take the value from global state and save it into the following local state:
    const handleSubmit = (event: React.FormEvent) => { // Correct event type to React.FormEvent
        event.preventDefault(); // Prevent default form submission behavior
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount);
        navigate("/search") // Call saveSearchValues with updated values
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // Set maximum date to current year plus 1

    return(
        <form onSubmit= {handleSubmit} className="-mt-8p-3 bg-gray rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
        >
            <div className="flex flex-row items-center flex-1 bg-white p-2 ">
                {/* MdTravelExplore from react icon package */}
                <MdTravelExplore size ={25} className="mr-2"/>
                 <input placeholder="Where are you going?" className="text-md w-full focus:outline-none"
                 value={destination}
                //  sets the target for us anytime  a user types in input field 
                 onChange={(event)=> setDestination(event.target.value)}></input>
            </div>
            <div className="flex bg-white px-2 py-1 gap-2">
                <label className = "items-center flex ">
                    Adults: 
                    <input 
                    className="w-full p-1 focus: outine-none font-bold"
                     type="number" 
                     min={1} 
                     max={20}
                    value={adultCount}
                    onChange={(event) => setAdultCount(parseInt(event.target.value))}/>
                </label>
                <label className = "items-center flex ">
                    Children: 
                    <input
                     className="w-full p-1 focus: outine-none font-bold" 
                     type="number" 
                     min={0} 
                     max={20}
                    value={childCount}
                    onChange={(event) => setChildCount(parseInt(event.target.value))}/>
                </label>
            </div>
            <div>
                <DatePicker selected={checkIn} onChange={(date)=> setCheckIn(date as Date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                maxDate= {maxDate}
                placeholderText="Check-in Date"
                className="min-w-full bg-white p-2 focus:outline-none text-gray-900"
                wrapperClassName="min-w-full"
                />
            </div>
            <div>
                <DatePicker 
                selected={checkOut} 
                onChange={(date)=> setCheckOut(date as Date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                maxDate= {maxDate}
                placeholderText="Check-in Date"
                className="min-w-full bg-white p-2 focus:outline-none text-gray-900"
                wrapperClassName="min-w-full"/>
                
            </div>
            <div className="flex gap-1">
                <button className="w-2/3 bg-orange-600 text--white h-full p-2 font-bold text-xl hoover:bg-orange-500">
                    Search
                </button>
                <button className="w-2/3 bg-orange-600 text--white h-full p-2 font-bold text-xl hoover:bg-orange-500">
                    Clear
                </button>
            </div>
            </form>
    );
};

export default SearchBar;
