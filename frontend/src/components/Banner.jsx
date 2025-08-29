import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

const Banner = () => {
  return (
    <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}} viewport={{once:true}} className='flex flex-col md:flex-row md:items-center items-center justify-between px-6 md:px-16 pt-8 bg-gradient-to-r from-[#1B263B] to-[#4B6587] max-w-5xl mx-5 md:mx-auto rounded-3xl overflow-hidden'>
        <motion.div initial={{opacity:0,x:-50}} whileInView={{opacity:1,x:0}} transition={{duration:0.6,delay:0.2}} viewport={{once:true}} className='py-8 text-white max-w-md'>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>Wanna own a Luxury Car?</h2>
            <p className='mt-3 text-lg font-light'>Earn effortlessly by listing your vehicle with us</p>
            <p className='mt-2 text-base leading-relaxed'>We manage insurance, driver verification, and secure payments for seamless passive income.</p>
            <Link to='/cars'>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} className='px-7 py-3 mt-6 bg-amber-400 hover:bg-amber-300 text-[#1B263B] font-semibold rounded-xl text-base transition-colors cursor-pointer'>List Your Car</motion.button>
            </Link>
        </motion.div>
        <motion.img initial={{opacity:0,x:50}} whileInView={{opacity:1,x:0}} transition={{duration:0.6,delay:0.3}} viewport={{once:true}} src={assets.banner_car_image} alt='car' className='max-h-45 mt-10' />
    </motion.div>
  )
}

export default Banner
