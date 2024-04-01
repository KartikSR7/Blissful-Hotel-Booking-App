import { useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../../contexts/SearchContext";

type Props ={
    hotelId: String;
    pricePerNight: number;

};

type GuestInfoFormData ={
checkIn: Date;
checkOut: Date;
adultCount: number;
childCount: number
}

const GuestInfoForm =(hotelId, pricePerNight} : Props) => {
    const search = useSearchContext();
    search
    const {
        watch, 
        register,
         handleSubmit,
          setValue, 
          formState: {errors},
        } = useForm<GuestInfoFormData>({
            defaultValues:{
                checkIn: search.checkIn,
                checkOut: search.checkOut,
                adultCount: search.adultCount,
                childCount: search.childCount
            }
        });

        const checkIn = watch("checkIn");
        const checkOut = watch("checkOut");

        const minDate = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);

        return(
            <div className="flex flex-col p-4 bg-blue-200 gap-4">
                <h3 className="text-md font-bold">£{pricePerNight}/night</h3>
                <form>
                    <div className="grid grid-cols gap-4">
                        <div>
                            <DatePicker 
                                required
                                selected={checkIn} 
                                onChange={(date)=> setValue("checkIn", date as Date)}
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
                                required
                                selected={checkOut} 
                                onChange={(date)=> setValue("checkOut", date as Date)}
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


                    </div>
                </form>
            </div>
        )

};

export default GuestInfoForm;