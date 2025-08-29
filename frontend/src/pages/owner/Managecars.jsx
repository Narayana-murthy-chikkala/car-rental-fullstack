import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Managecars = () => {
  const [cars, setCars] = useState([]);
  const { isOwner, axios, currency } = useAppContext();

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm('Are you sure.. do you really wanna delete this car?');
      if (!confirm) return null;
      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
    hover: {
      scale: 1.02,
      backgroundColor: '#f9fafb',
      transition: { duration: 0.2 },
    },
  };

  // Animation for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="px-4 pt-10 md:px-10 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Title
        title="Manage cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <motion.tr
                key={index}
                className="border-t border-borderColor"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} | {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {car.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </td>
                <td className="flex items-center p-3 gap-2">
                  <button
                    onClick={() => toggleAvailability(car._id)}
                    className="p-1"
                    aria-label={car.isAvailable ? 'Make car unavailable' : 'Make car available'}
                  >
                    <img
                      src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                      className="cursor-pointer"
                      alt=""
                    />
                  </button>
                  <button
                    onClick={() => deleteCar(car._id)}
                    className="p-1"
                    aria-label="Delete car"
                  >
                    <img src={assets.delete_icon} className="cursor-pointer" alt="" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Managecars;