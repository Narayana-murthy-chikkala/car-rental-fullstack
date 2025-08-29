import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Animation variants for the sidebar container
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Animation variants for the profile image section
  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Animation variants for navigation links
  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
    hover: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="group relative" variants={imageVariants} initial="rest" whileHover="hover">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtIU7E3x2EYvNYP_dM2NVGvkBLsNT0_P6B1w&s'
            }
            className="h-20 md:h-20 w-12 md:w-20 rounded-full mx-auto"
          />
          <input type="file" id="image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} />
          </div>
        </label>
      </motion.div>
      {image && (
        <motion.button
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
          onClick={updateImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save <img src={assets.check_icon} width={13} />
        </motion.button>
      )}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <motion.div
            key={index}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index}
          >
            <NavLink
              to={link.path}
              className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
                link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'
              }`}
            >
              <img src={link.path === location.pathname ? link.coloredIcon : link.icon} />
              <span className="max-md:hidden">{link.name}</span>
              <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;