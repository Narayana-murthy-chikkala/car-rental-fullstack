import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();
  const [state, setState] = React.useState('login');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const endpoint = state === 'login' ? '/api/user/login' : '/api/user/register';
      const payload = state === 'login' ? { email, password } : { name, email, password };
      const response = await axios.post(endpoint, payload);
      const data = response.data;
      console.log('Login/Register response:', data); // Debug

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        console.log('Token stored:', data.token); // Debug
        setTimeout(() => {
          navigate('/');
          setShowLogin(false);
          toast.success(state === 'login' ? 'Logged in successfully' : 'Account created successfully');
        }, 100);
      } else {
        toast.error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Login/Register error:', error); // Debug
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during the request';
      toast.error(errorMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#4f46e5', transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className='flex justify-center items-center min-h-[calc(100vh-8rem)] bg-gray-100'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200'
      >
        <p className='text-3xl font-bold text-center text-gray-800'>
          <span className='text-indigo-600'>User</span>{' '}
          {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className='w-full'>
            <label className='text-gray-600 text-sm'>Name</label>
            <motion.input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter your name'
              className='border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none'
              type='text'
              required
              variants={inputVariants}
              whileFocus="focus"
            />
          </div>
        )}

        <div className='w-full'>
          <label className='text-gray-600 text-sm'>Email</label>
          <motion.input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Enter your email'
            className='border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none'
            type='email'
            required
            variants={inputVariants}
            whileFocus="focus"
          />
        </div>

        <div className='w-full'>
          <label className='text-gray-600 text-sm'>Password</label>
          <motion.input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Enter your password'
            className='border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none'
            type='password'
            required
            variants={inputVariants}
            whileFocus="focus"
          />
        </div>

        {state === 'register' ? (
          <p className='text-sm text-gray-500'>
            Already have an account?{' '}
            <motion.span
              onClick={() => setState('login')}
              className='text-indigo-600 font-medium cursor-pointer hover:underline'
              whileHover={{ scale: 1.1 }}
            >
              Login here
            </motion.span>
          </p>
        ) : (
          <p className='text-sm text-gray-500'>
            Don't have an account?{' '}
            <motion.span
              onClick={() => setState('register')}
              className='text-indigo-600 font-medium cursor-pointer hover:underline'
              whileHover={{ scale: 1.1 }}
            >
              Sign up here
            </motion.span>
          </p>
        )}

        <motion.button
          className='bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold w-full py-3 rounded-lg shadow-md'
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Login;