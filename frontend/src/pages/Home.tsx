import * as apiClient from '../api-client';
import { useQuery } from 'react-query';
import LatestDestinationCard from '../components/LatestDestinationCard';


const Home = () => {
    const { data: hotels, isLoading, isError } = useQuery("fetchQuery", apiClient.fetchHotels);

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (isError || !hotels) {
        return <span>Error fetching data</span>;
    }

    const topRowHotels = hotels.slice(0, 2);
    const bottomRowHotels = hotels.slice(2);

    return (
        <div className="space-y-3">
            <h2 className="text-3xl font-bold">Latest Destinations</h2>
            <p>Most recent destinations</p>
            <div className="grid gap-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {topRowHotels.map((hotel) => (
                        <LatestDestinationCard hotel={hotel} /> 
                    ))}
                </div>
                <div className= "grid md:grid-cols-3 gap-4">
                    {bottomRowHotels.map((hotel)=>(
                        <LatestDestinationCard hotel={hotel}/>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
