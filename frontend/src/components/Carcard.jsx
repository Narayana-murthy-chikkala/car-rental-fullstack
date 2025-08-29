import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const Carcard = ({car}) => {
    const currency=import.meta.env.VITE_CURRENCY;
    const navigate=useNavigate();
    return (
    <motion.div onClick={()=>{navigate(`/car-details/${car._id}`);scrollTo(0,0)}} className='group rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer' initial={{opacity:0,y:40,scale:0.95}} whileInView={{opacity:1,y:0,scale:1}} whileHover={{scale:1.03,rotate:0.2}} transition={{duration:0.6,ease:"easeOut"}} viewport={{once:true}}>
        <div className='relative h-48 overflow-hidden'>
            <img src={car.image} alt='Car Image' className='w-full h-full object-cover transition-transform duration-400 group-hover:scale-110' />
            
            {car.isAvaliable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}
            
            <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                <span className='text-sm text-white/90'>/day</span>
            </div>
        </div>
        <div className='p-4 sm:p-5'>
            <div className='flex justify-between items-start mb-2'>
                <div>
                    <h3 className='text-lg font-medium'>
                        {car.brand} {car.model}
                    </h3>
                    <p className='text-muted-foreground text-sm'>{car.category} | {car.year} </p>
                </div>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.users_icon} className='h-4 mr-2' />
                    <span>{car.seatin_capacity} seats</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.car_icon} className='h-4 mr-2' />
                    <span>{car.transmission}</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.fuel_icon} className='h-4 mr-2' />
                    <span>{car.fuel_type}</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.location_icon} className='h-4 mr-2' />
                    <span>{car.location}</span>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Carcard
