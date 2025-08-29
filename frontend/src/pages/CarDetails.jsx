import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Notfound from "../components/Notfound";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CarDetails = () => {
  const { id } = useParams();
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate dates
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(pickup) || isNaN(returnD)) {
        toast.error("Please select valid dates");
        return;
      }
      if (pickup < today) {
        toast.error("Pickup date cannot be in the past");
        return;
      }
      if (pickup >= returnD) {
        toast.error("Pickup date must be before return date");
        return;
      }

      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const selectedCar = cars.find((car) => car._id === id);
    if (selectedCar) {
      setCar(selectedCar);
    } else {
      toast.error("Car not found");
    }
  }, [cars, id]);

  // Set default dates if not already set
  useEffect(() => {
    if (!pickupDate) {
      const today = new Date();
      setPickupDate(today.toISOString().split("T")[0]);
    }
    if (!returnDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setReturnDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [pickupDate, returnDate, setPickupDate, setReturnDate]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <img src={assets.arrow_icon} className="rotate-180 h-5 opacity-80" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left car details */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <img
              src={car.image}
              className="w-full h-auto md:max-h-[500px] object-cover rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            />
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <div key={index} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <img src={icon} className="h-6 mb-2 opacity-90" />
                  <span className="text-gray-700 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 mt-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>
            <hr className="border-gray-200 my-6" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                  <li key={item} className="flex items-center text-gray-600">
                    <img src={assets.check_icon} className="h-4 mr-2 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shadow-xl h-max sticky top-20 rounded-2xl p-8 space-y-5 bg-white"
        >
          <div className="flex flex-col gap-2">
            <p className="text-2xl text-gray-800 font-bold">
              {currency}
              {car.pricePerDay}
            </p>
            <span className="text-sm text-gray-500 font-normal">/day</span>
            <hr className="border-gray-200 my-5" />
            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-date" className="text-sm font-medium text-gray-700">
                Pickup Date
              </label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                id="pickup-date"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="return-date" className="text-sm font-medium text-gray-700">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                id="return-date"
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 font-semibold text-white rounded-lg cursor-pointer">
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-16">
      <Notfound />
    </p>
  );
};

export default CarDetails;