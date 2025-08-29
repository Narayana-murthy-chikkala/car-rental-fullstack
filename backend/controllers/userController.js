import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Cars.js";

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Enhanced input validation
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Please fill all fields and ensure password is at least 6 characters' });
    }

    // Updated email regex
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) {
      console.error('Register user: Failed to create user');
      return res.status(500).json({ success: false, message: 'Failed to create user' });
    }
    const token = generateToken(user._id);
    console.log('Register user: User created, token generated:', user.email); // Debug
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login user: User not found for email:', email);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login user: Invalid password for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(user._id);
    console.log('Login user: Token generated for:', user.email); // Debug
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

// Get user data using JWT token
export const getUserData = async (req, res) => {
  try {
    console.log('Get user data: req.user:', req.user); // Debug
    if (!req.user) {
      console.log('Get user data: No user attached to request');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user', // Fallback to 'user'
        image: user.image || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get user data error:', error.message, error.stack);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

// Get all cars for the frontend
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.error('Get cars error:', error.message, error.stack);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};