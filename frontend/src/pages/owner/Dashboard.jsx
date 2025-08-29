import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets, dummyDashboardData } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { axios, currency, isOwner } = useAppContext();
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: 'Total cars', value: data.totalCars, icon: assets.carIconColored },
    { title: 'Total bookings', value: data.totalBookings, icon: assets.listIconColored },
    { title: 'Confirmed', value: data.completedBookings, icon: assets.listIconColored },
    { title: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard');
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  // Animation variants for cards
  const cardVariants = {
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
      scale: 1.05,
      boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 },
    },
  };

  // Animation variants for recent bookings and revenue
  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
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
      className="px-4 pt-10 md:px-10 flex-1 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-4xl">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            className="flex gap-3 items-center justify-between p-5 rounded-lg shadow-sm bg-white border border-gray-200 hover:shadow-md transition-all"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
          >
            <div>
              <h1 className="text-xs uppercase tracking-wide text-gray-500">{card.title}</h1>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <img src={card.icon} className="h-5 w-5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* Recent booking */}
        <motion.div
          className="p-5 md:p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all max-w-lg w-full"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-lg font-semibold text-gray-800">Recent Bookings</h1>
          <p className="text-sm text-gray-500">Latest customer bookings</p>
          {data.recentBookings.map((booking, index) => (
            <motion.div
              key={index}
              className="mt-5 flex items-center justify-between border-b last:border-b-0 border-gray-100 pb-3"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img src={assets.listIconColored} className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-xs text-gray-500">{booking.createdAt.split('T')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-700">
                  {currency}
                  {booking.price}
                </p>
                <p
                  className={`px-3 py-0.5 border rounded-full text-xs ${
                    booking.status === 'pending'
                      ? 'bg-yellow-50 border-yellow-400 text-yellow-600'
                      : 'bg-green-50 border-green-400 text-green-600'
                  }`}
                >
                  {booking.status}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Monthly revenue */}
        <motion.div
          className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;