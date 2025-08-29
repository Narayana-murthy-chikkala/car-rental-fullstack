import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Addcar = () => {
  
  const {axios,currency}=useAppContext();
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });
  const [isLoading,setIsLoading]=useState(false)
  const onSubmithandler = async (e) => {
    e.preventDefault();
    if(isLoading) return null;

    setIsLoading(true)
    try {
      const formData=new FormData()
      formData.append('image',image)
      formData.append('carData',JSON.stringify(car))

      const {data}=await axios.post('/api/owner/add-car',formData)
      if(data.success)
      {
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <motion.div className="px-4 py-10 md:px-10 flex-1" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability and car specifications."
      />

      <motion.form
        onSubmit={onSubmithandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}
      >
        {/* Image Upload */}
        <motion.div className="flex items-center gap-2 w-full" whileHover={{scale:1.02}}>
          <label htmlFor="car-image">
            <motion.img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Upload Preview"
              className="h-14 w-14 rounded cursor-pointer object-cover border"
              whileHover={{scale:1.05}}
            />
          </label>
          <input
            type="file"
            id="car-image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </motion.div>

        {/* Car Details */}
        <p>Company:</p>
        <input
          type="text"
          placeholder="Companies like BMW, Audi, Scoda..."
          value={car.brand}
          onChange={e=>setCar({...car,brand: e.target.value})}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
        />
        <p>Model:</p>
        <input
          type="text"
          placeholder="model like XS, E-class, M4..."
          value={car.model}
          onChange={e=>setCar({...car,model: e.target.value})}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
        />
        {/*Car year, price, transmission */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
          <p>Year:</p>
          <input
          type="number"
          placeholder="Enter the year"
          value={car.year}
          onChange={e=>setCar({...car,year: e.target.value})}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          />
          </div>
          <div className='flex flex-col w-full'>
          <p>Daily Price in {currency}:</p>
          <input
          type="number"
          placeholder="$100"
          value={car.pricePerDay}
          onChange={e=>setCar({...car,pricePerDay: e.target.value})}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          />
          </div>
          <div className='flex flex-col w-full'>
          <p>Transmission:</p>
          <select onChange={e=>setCar({...car,transmission:e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a transmission</option>
            <option value='Automatic'>Automatic</option>
            <option value='Manual'>Manual</option>
            <option value='Semi-automatic'>Semi-automatic</option>
          </select>
          </div>
        </div>
        {/*Car category, fuel type, seating capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
          <p>Category :</p>
          <select onChange={e=>setCar({...car,category:e.target.value})} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a category</option>
            <option value='Sedan'>Sedan</option>
            <option value='SUV'>SUV</option>
            <option value='Sports'>Sports</option>
            <option value='Offroad'>Offroad</option>
            <option value='Van'>Van</option>
          </select>
          </div>
          <div className='flex flex-col w-full'>
          <p>Fuel_Type :</p>
          <select onChange={e=>setCar({...car,fuel_type:e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a fuel type</option>
            <option value='Petrol'>Petrol</option>
            <option value='Diesel'>Diesel</option>
            <option value='Gas'>Gas</option>
            <option value='Electric'>Electric</option>
            <option value='Hybrid'>Hybrid</option>
          </select>
          </div>
          <div className='flex flex-col w-full'>
          <p>Seating capacity :</p>
          <select onChange={e=>setCar({...car,seating_capacity:e.target.value})} value={car.seating_capacity} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select seating capacity</option>
            <option value='2'>2</option>
            <option value='4'>4</option>
            <option value='6'>6</option>
          </select>
          </div>
        </div>
        
        {/*Car location */}
        <div className='flex flex-col w-full'>
          <p>Location :</p>
          <select onChange={e=>setCar({...car,location:e.target.value})} value={car.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a location</option>
            <option value='New york'>New york</option>
            <option value='Los Angeles'>Los Angeles</option>
            <option value='Houstan'>Houstan</option>
            <option value='Chicago'>Chicago</option>
          </select>
        </div>

        {/*Car description */}
        <div className='flex flex-col w-full'>
          <p>Description:</p>
          <textarea rows={5}
          placeholder="Enter the desciption"
          value={car.description}
          onChange={e=>setCar({...car,description: e.target.value})}
          className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          whileHover={{scale:1.05}} whileTap={{scale:0.95}}
        >
          {isLoading ? 'Adding...' : 'Add Car'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Addcar;
