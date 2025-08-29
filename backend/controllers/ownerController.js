import imagekit from '../configs/imageKit.js';
import Booking from '../models/Bookings.js';
import Car from '../models/Cars.js';
import User from '../models/User.js';
import fs from 'fs';

export const changeRoleToOwner = async (req, res) => {
    try {
        // Validate req.user
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const { _id } = req.user;
        
        // Update user role
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { role: 'owner' },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Now you can list cars' });
    } catch (error) {
        console.error('Error in changeRoleToOwner:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to List car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        // Validate carData
        if (!req.body.carData) {
            return res.status(400).json({ success: false, message: "carData is required" });
        }

        let car;
        try {
            car = JSON.parse(req.body.carData);
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid carData JSON format" });
        }

        // Check for required fields
        const requiredFields = ['brand', 'model', 'year', 'category', 'seating_capacity', 'fuel_type', 'transmission', 'pricePerDay', 'location', 'description'];
        const missingFields = requiredFields.filter(field => !car[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Upload image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        // Optimize image URL
        const optimizedimageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedimageURL;
        await Car.create({ ...car, owner: _id, image });

        res.json({ success: true, message: 'Car added successfully!' });
    } catch (error) {
        console.error('Error in addCar:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to list Owner cars
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.error('Error in getOwnerCars:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        // Check if the car belongs to the user
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        if (car.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({ success: true, message: 'Availability toggled' });
    } catch (error) {
        console.error('Error in toggleCarAvailability:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to delete the car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        // Check if the car belongs to the user
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        if (car.owner.toString() !== _id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Instead of setting owner to null, consider deleting the car
        await Car.findByIdAndDelete(carId);

        res.json({ success: true, message: 'Car successfully deleted!' });
    } catch (error) {
        console.error('Error in deleteCar:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });
        
        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        // Calculate MonthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error('Error in getDashboardData:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// API to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        // Validate image file
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        // Upload image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        // Optimize image URL
        const optimizedimageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedimageURL;

        await User.findByIdAndUpdate(_id, { image });
        res.json({ success: true, message: "Image updated" });
    } catch (error) {
        console.error('Error in updateUserImage:', error.message, error.stack);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

export default changeRoleToOwner;