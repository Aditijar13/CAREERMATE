const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, targetRole, currentRole, yearsOfExperience } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  const user = await User.create({
    name, email, password,
    targetRole: targetRole || '',
    currentRole: currentRole || '',
    yearsOfExperience: yearsOfExperience || 0
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      currentRole: user.currentRole,
      yearsOfExperience: user.yearsOfExperience
    }
  });
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      currentRole: user.currentRole,
      yearsOfExperience: user.yearsOfExperience
    }
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('resumes');
  res.json({ success: true, user });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const { name, targetRole, currentRole, yearsOfExperience } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, targetRole, currentRole, yearsOfExperience },
    { new: true, runValidators: true }
  );

  res.json({ success: true, message: 'Profile updated', user });
};

module.exports = { register, login, getMe, updateProfile };
