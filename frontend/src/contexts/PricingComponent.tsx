// PricingComponent.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { PricingInput } from '/Users/kartiksally/Desktop/Blissful-Hotel-Booking-App/backend/src/shared/types.ts';


interface PricingComponentProps {
  roomTypes: string[];
}

const PricingComponent: React.FC<PricingComponentProps> = ({ roomTypes }) => {
    const [roomType, setRoomType] = useState<string>(roomTypes[0]);
    const [checkInDate, setCheckInDate] = useState<Date>(new Date());
    const [checkOutDate, setCheckOutDate] = useState<Date>(new Date());
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const pricingInput: PricingInput = { roomType, checkInDate, checkOutDate };
            const response = await axios.post('/api/price', pricingInput);
            setDynamicPrice(response.data.price);
        } catch (error) {
            console.error('Error fetching dynamic price:', error);
            setDynamicPrice(null);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Room Type:
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    {roomTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Check-in Date:
                <input
                    type="date"
                    value={checkInDate.toISOString().slice(0, 10)}
                    onChange={(e) => setCheckInDate(new Date(e.target.value))}
                />
            </label>
            <label>
                Check-out Date:
                <input
                    type="date"
                    value={checkOutDate.toISOString().slice(0, 10)}
                    onChange={(e) => setCheckOutDate(new Date(e.target.value))}
                />
            </label>
            <button type="submit">Get Dynamic Price</button>
            {dynamicPrice !== null && <p>Dynamic Price: ${dynamicPrice.toFixed(2)}</p>}
        </form>
    );
};


export default PricingComponent;