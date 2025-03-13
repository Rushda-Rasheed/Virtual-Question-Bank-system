
import bcrypt from 'bcrypt';
import User from "../models/addusers.model.js";
import jwt from 'jsonwebtoken';


export const createUser = async (req, res) => {
  const { fullName, userName, phoneNumber, email, password } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      fullName,
      userName,
      phoneNumber,
      email,
      password,
      role: 'user' 
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id, fullName, userName, phoneNumber, email, password } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updateData = { fullName, userName, phoneNumber, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
 };

export const fetchUserDetails = async (req, res) => {
  try {
   
    const userId = req.user?.id; 
    if (!userId) {
      return res.status(403).json({ message: 'Access denied. User not authenticated.' });
    }

   
    const user = await User.findById(userId).select('fullName userName email phoneNumber profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({
      fullName: user.fullName || '',
      userName: user.userName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      profileImage: user.profileImage || null, // Return null if profileImage doesn't exist
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user?.id; // Fetch the user ID from the authenticated user's token
  const { fullName, userName, phoneNumber, email, password } = req.body;

  if (!userId) {
    return res.status(403).json({ message: "Access denied. User not authenticated." });
  }

  try {
    const updateData = { fullName, userName, phoneNumber, email };

    // Hash the password if it's included in the update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        fullName: updatedUser.fullName,
        userName: updatedUser.userName,
        phoneNumber: updatedUser.phoneNumber,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile.", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
