import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import Carcard from '../components/Carcard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion'

const Cars = () => {

  //getting search params from url
  const [searchParams]=useSearchParams()
  const pickupLocation=searchParams.get('pickupLocation')
  const pickupDate=searchParams.get('pickupDate')
  const returnDate=searchParams.get('returnDate')

  const {cars,axios}=useAppContext()

  const [input, setInput] = useState('');

  const isSearchData=pickupLocation && pickupDate && returnDate
  const [filteredCars,setFilteredCars]=useState([])

  const applyFilter=async()=>{
    if(input==='')
    {
      setFilteredCars(cars);
      return null;
    }
    const filtered=cars.slice().filter(((car)=>{
    return car.brand.toLowerCase().includes(input.toLowerCase())
    || car.model.toLowerCase().includes(input.toLowerCase())
    || car.category.toLowerCase().includes(input.toLowerCase())
    || car.transmission.toLowerCase().includes(input.toLowerCase())
  }))
  setFilteredCars(filtered);
  }

  const searchCarAvailability=async()=>{
    const {data}=await axios.post('/api/bookings/check-availability',
      {location:pickupLocation,pickupDate,returnDate})
      if(data.success){
        setFilteredCars(data.availableCars)
        if(data.availableCars.length===0)
        {
          toast('No cars available')
        }
        return null
      }
  }

  useEffect(()=>{
    isSearchData && searchCarAvailability()
  },[])
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', input); // Placeholder for search logic
  };

  useEffect(()=>{
    cars.length>0 && !isSearchData && applyFilter()
  },[input,cars])

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-gray-100 max-md:px-4'>
        <Title title='Available Cars' subTitle='Explore our choice of vehicles available for your next adventure 😉'/>
        <form onSubmit={handleSearch} className='flex items-center border pl-4 gap-2 bg-white border-gray-300 h-[46px] rounded-full max-w-lg w-full'>
          <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='currentColor' className='text-gray-500'>
            <path d='M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8'/>
          </svg>
          <input onChange={(e) => setInput(e.target.value)} value={input} type='text' className='w-full h-full outline-none text-sm text-gray-500' />
          <button type='submit' className='bg-indigo-500 w-32 h-9 rounded-full text-sm text-white mr-1'>Search</button>
        </form>
      </div>
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p>Showing {filteredCars.length} Cars</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <motion.div key={index} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{duration:0.5,delay:index*0.1}} viewport={{once:true}}>
              <Carcard car={car}/>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cars
