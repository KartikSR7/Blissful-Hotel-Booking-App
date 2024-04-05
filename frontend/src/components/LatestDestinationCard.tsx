import { Link } from 'react-router-dom';
import { HotelType } from '../../../backend/src/shared/types';

type Props = {
    hotel: HotelType;
}

const LatestDestinationCard = ({ hotel }: Props) => {
    return (
        <Link to={`/detail/${hotel}`} className="relative cursor-pointer overflow-hidden rounded-md"> {/* Fixed typo in overflow-hidden */}
            <div className="h-[300px]">
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" /> {/* Fixed typo in hotel.imageUrls */}
            </div>
            <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
                <span className="text-white font-bold tracking-tight text-3xl">{hotel.name}</span>
            </div>
        </Link>
    );
}

export default LatestDestinationCard;
