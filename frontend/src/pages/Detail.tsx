import { useQuery } from "react-query";
import { useParams } from "react-router";
import * as apiClient from './../api-client'; 
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm";


const Detail = () => {
    const { hotelId } = useParams();

    const { data: hotel } = useQuery(
        "fetchHotelById",
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        }
    );

    if (!hotel) {
        return <></>;
      }
    

    return (
        <div className="space-y-6">
            {/* Hotel star rating section */}
            <div>
                <span className="flex">
                    {/* Check if hotel exists and render star icons */}
                    {hotel && Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar key={index} className="fill-orange-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotel?.name}</h1>
            </div>
    
            {/* Grid for displaying hotel images */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Check if hotel exists and map through image URLs */}
                {hotel.imageUrls.map(image => (
                    <div key={image} className="h-[300px]">
                        <img
                            src={image}
                            alt={hotel.name}
                            className="rounded-md w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>
    
            {/* Grid for displaying hotel facilities */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Check if hotel exists and map through facilities */}
                {hotel?.facilities.map((facility, index) => (
                    <div key={index} className="border border-slate-300 p-2 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr">
                <div className="whitespace-pre-line">{hotel.description}</div>
                <div className="h-fit">
                    <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id}/>
                </div>
            </div>
        </div>
    );
    
  };


export default Detail;
