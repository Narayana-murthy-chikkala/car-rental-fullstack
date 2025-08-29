import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {motion} from 'motion/react'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [error, setError] = useState('');

  const { pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    // validation
    if (!pickupDate || !returnDate) {
      setError('Please select both pickup and return dates.');
      return;
    }

    if (new Date(returnDate) < new Date(pickupDate)) {
      setError('Return date cannot be before pickup date.');
      return;
    }

    setError('');
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
    initial={{y:50,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.9,delay:0.3}}
    className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-100 text-center py-8">
      <motion.h1
        initial={{y:50,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.9,delay:0.3}}
      className="text-4xl sm:text-5xl font-bold text-gray-800">
        All Cars on Rent!
      </motion.h1>

      <motion.form
        initial={{scale:0.99,opacity:0,y:50}}
        animate={{scale:1,opacity:1,y:0}}
        transition={{duration:0.6,delay:0.4}}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl w-full max-w-md md:max-w-3xl bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Pickup location */}
          <div className="flex flex-col w-full md:w-auto">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full md:w-44 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {pickupLocation || 'Select Location'}
            </p>
          </div>

          {/* Pickup date */}
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="Pickup-date" className="text-sm text-gray-600">
              Pick-up
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="Pickup-date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full md:w-44 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Return date */}
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="Return-date" className="text-sm text-gray-600">
              Return
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="Return-date"
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="w-full md:w-44 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
          >
            <img
              src={assets.search_icon}
              alt="search"
              className="brightness-300"
            />
            Search
          </button>
        </div>
      </motion.form>

      {/* Validation error */}
      {error && (
        <p className="text-red-500 font-medium text-sm mt-2">{error}</p>
      )}

      <img src={assets.main_car} alt="Car" className="max-h-74" />
    </motion.div>
  );
};

export default Hero;
