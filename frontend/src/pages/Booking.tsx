import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/ManageHotelForm/BookingForm/BookingForm";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailsSummary";
import { useSearchContext } from "../contexts/SearchContext";


const Booking = () =>{
    const search = useSearchContext();
    const { hotelId } = useParams();

    const [ numberOfNights,  setNumberOfNights] = useState<number>(0);

    useEffect(() =>{
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60  * 60 * 24) ;

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const { data: hotel  } = useQuery(
        "fetchHotelByID", 
        ()=>   apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        });
    const { data: currentUser } = useQuery(
        "fetchCurrentUser", 
        apiClient.fetchCurrentUser
    );

    if(!hotel){
        return<></>;
    }
    console.log(currentUser?.email);

    return<div className="grid md:grid-cols-[1fr_2fr]">
        <BookingDetailSummary 
        checkIn={search.checkIn} 
        checkOut={search.checkOut} 
        adultCount={search.adultCount}
         childCount={search.childCount}
         numberOfNights={numberOfNights}
         hotel={hotel}/>
        <div className="bg-green-200">BOOKING DETAILS SUMMARY</div>
        {/* booking form will only dispay if we have currentUser */}
        {currentUser &&<BookingForm currentUser={currentUser}/> }
        
    </div>; 
    //empty return just to pick that above is a component
};



export default Booking;