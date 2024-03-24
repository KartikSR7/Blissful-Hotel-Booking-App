// Importing the necessary hooks and components from external modules
import { useFormContext } from "react-hook-form"; // Importing useFormContext hook from react-hook-form
import { HotelFormData } from "./ManageHotelForm"; // Importing HotelFormData from another file

// Functional component for ImageSection
const ImageSection = () => {
    // Destructuring useFormContext to get register and errors from the form context
    const {
        register, // Register function from react-hook-form
        watch,
        setValue, // Setting a value in the
        formState: { errors }, // Destructuring error from formState
    } = useFormContext<HotelFormData>();
     const existingImageUrls = watch("imageUrls"); 

     const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
         imageurl: string)=>{
         event.preventDefault();
         setValue("imageUrls", existingImageUrls.filter((url)=>  url !== imageurl));


     };
    // Rendering the component
    return(
        <div>
            {/* Heading for the Images section */}
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            {/* Container for file input */}
            <div className="border rounded p-4 flex flex-col gap-4">
                {/* File input for selecting images */}
                {existingImageUrls && (
                    <div className="grid grid-cols-6 gap-4">
                        {existingImageUrls.map((url)=>(
                            <div className="relative group">
                                <img src={url} className ="min-h-full object-cover"/>
                                <button 
                                onClick={(event)=>handleDelete(event,  url)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                                    Delete</button>
                            </div>

                        ))}
                    </div>
                )}
                <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    className="w-full  text-gray-700 font-normal"
                    {...register("imageFiles", { // Registering file input with React Hook Form
                        validate: (imageFiles) => { 
                            const totalLength = imageFiles.length;

                            if(totalLength === 0){
                                return "At least one image is required";
                            }

                            if(totalLength > 6){
                                return "Maximum 6 images allowed";
                            }
                            return true;
                        }
                    })}
                />
                {/* Error message for file input */}
                {/* Error messages can be displayed based on form validation */}
                {/* For example, displaying an error message if the file size exceeds a certain limit */}
                {/* {error && <span className="text-red-500">{error.message}</span>} */}
            </div>
            {errors.imageFiles &&(
                <span className="text-red-500 text-sm font-bold">
                    {errors.imageFiles.message}
                </span>
            )}
        </div>
    );
};

// Exporting the ImageSection component as default
export default ImageSection;
