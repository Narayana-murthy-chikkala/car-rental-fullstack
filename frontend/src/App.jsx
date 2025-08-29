import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import Mybookings from './pages/Mybookings';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import Addcar from './pages/owner/Addcar';
import Managecars from './pages/owner/Managecars';
import Managebookings from './pages/owner/Managebookings';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
  const isOwnerPath = useLocation().pathname.startsWith('/owner');
  const { showLogin } = useAppContext();

  return (
    <div className='flex flex-col min-h-screen'>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showLogin && <Login />} {/* Render Login as a modal when showLogin is true */}

      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/car-details/:id' element={<CarDetails />} />
          <Route path='/cars' element={<Cars />} />
          <Route path='/my-bookings' element={<Mybookings />} />
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-car' element={<Addcar />} />
            <Route path='manage-cars' element={<Managecars />} />
            <Route path='manage-bookings' element={<Managebookings />} />
          </Route>
        </Routes>
      </main>

      {!isOwnerPath && <Footer />}
    </div>
  );
};

export default App;