import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      {/* Image container */}
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
          alt={hotel.name}
        />
      </div>

      {/* Content container */}
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        {/* Star rating and hotel type */}
        <div className="flex items-center">
          <span className="flex">
            {/* Rendering star icons based on hotel rating */}
            {Array.from({ length: hotel.starRating }).map((_, index) => (
              <AiFillStar key={index} className="fill-orange-400" />
            ))}
          </span>
          {/* Hotel type */}
          <span className="ml-1 text-sm">{hotel.type}</span>
        </div>

        {/* Hotel name */}
        <Link
          to={`/detail/${hotel._id}`}
          className="text-2xl font-bold cursor-pointer"
        >
          {hotel.name}
        </Link>

        <div>
          {/* Hotel description */}
          <div className="line-clamp-4">{hotel.description}</div>

          {/* Facilities and price */}
          <div className="grid grid-cols-2 items-end whitespace-nowrap">
            {/* Facilities */}
            <div className="flex gap-1 items-center">
              {hotel.facilities.slice(0, 3).map((facility: string, index: number) => (
                <span
                  key={index}
                  className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap"
                >
                  {facility}
                </span>
              ))}
              {hotel.facilities.length > 3 && (
                <span className="text-sm">{`+${hotel.facilities.length - 3} more`}</span>
              )}
            </div>

            {/* Price and View More button */}
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold">£{hotel.pricePerNight} per night</span>
              <Link
                to={`/detail/${hotel._id}`}
                className="bg-orange-600 text-white p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;