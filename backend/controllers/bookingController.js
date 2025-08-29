import Booking from "../models/Bookings.js";
import Car from "../models/Cars.js";

// Function to check availability of car for a given date
const checkAvailability = async (car, pickupDate, returnDate) => {
  try {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    pickup.setHours(0, 0, 0, 0);
    returnD.setHours(23, 59, 59, 999);

    if (pickup >= returnD) {
      throw new Error("Pickup date must be before return date");
    }

    // ✅ Only consider "confirmed" bookings as blocking
    const bookings = await Booking.find({
      car,
      status: "confirmed", // only confirmed blocks
      pickupDate: { $lte: returnD },
      returnDate: { $gte: pickup },
    });

    console.log(
      `Checking availability for car ${car} from ${pickup} to ${returnD}: ${bookings.length} conflicting confirmed bookings found`
    );

    return bookings.length === 0;
  } catch (error) {
    console.error(`Error in checkAvailability: ${error.message}`);
    throw error;
  }
};

// API to check availability of cars for the given date and location
export const checkAvailabilityofCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // Validate inputs
    if (!location || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Normalize and validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (isNaN(pickup) || isNaN(returnD)) {
      return res.json({ success: false, message: "Invalid date format" });
    }
    if (pickup >= returnD) {
      return res.json({ success: false, message: "Pickup date must be before return date" });
    }

    // Fetch all available cars for the given location
    const cars = await Car.find({ location, isAvailable: true });

    // Check car availability for the given date range
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
      return { ...car._doc, isAvailable };
    });
    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.error(`Error in checkAvailabilityofCar: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// API to create booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // Validate inputs
    if (!car || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Normalize and validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (isNaN(pickup) || isNaN(returnD)) {
      return res.json({ success: false, message: "Invalid date format" });
    }
    if (pickup >= returnD) {
      return res.json({ success: false, message: "Pickup date must be before return date" });
    }

    // Check availability
    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available for the selected fechas" });
    }

    // Fetch car data
    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Calculate price based on pickupDate and returnDate
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    picked.setHours(0, 0, 0, 0);
    returned.setHours(0, 0, 0, 0);
    const noOfDays = Math.max(1, Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)));
    const price = carData.pricePerDay * noOfDays;

    // Create booking
    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      status: "pending",
    });

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error(`Error in createBooking: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// API to list user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(`Error in getUserBookings: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// API to get owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(`Error in getOwnerBookings: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// API to change the booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    // Validate inputs
    if (!bookingId || !status) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(`Error in changeBookingStatus: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};