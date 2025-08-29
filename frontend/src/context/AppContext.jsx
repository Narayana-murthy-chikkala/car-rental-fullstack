import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);

  // Function to check if user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      console.log('fetchUser: Response:', data); // Debug
      if (data.success) {
        setUser(data.data);
        setIsOwner(data.data.role === 'owner');
      } else {
        console.log('fetchUser: Non-success response:', data.message);
        toast.error(data.message || 'Failed to fetch user data');
        navigate('/');
      }
    } catch (error) {
      console.error('fetchUser: Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user data';
      toast.error(errorMessage);
    }
  };

  // Function to fetch all cars from server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      console.log('fetchCars: Response:', data); // Debug
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message || 'Failed to fetch cars');
      }
    } catch (error) {
      console.error('fetchCars: Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cars';
      toast.error(errorMessage);
    }
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setShowLogin(true); // Ensure login page is visible
    axios.defaults.headers.common['Authorization'] = '';
    toast.success('You have been logged out');
    console.log('logout: Navigating to /login, showLogin set to true'); // Debug
    navigate('/login');
  };

  // useEffect to retrieve the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('useEffect: Retrieved token from localStorage:', storedToken); // Debug
    setToken(storedToken);
    fetchCars();
  }, []);

  // useEffect to fetch user data when token is available
  useEffect(() => {
    if (token && !user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('useEffect: Setting Authorization header with token:', token); // Debug
      fetchUser();
    }
  }, [token, user]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};