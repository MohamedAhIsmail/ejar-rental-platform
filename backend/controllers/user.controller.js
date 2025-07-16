import userModel from '../models/user.model.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { updateUserSchema } from '../config/joi.validation.js';
import notificationModel from '../models/notification.model.js';
dotenv.config();

/**
 * GET ALL USERS
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    //  only admin can see all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to see all users',
      });
    }

    const users = await userModel.find({}, { password: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message,
    });
  }
};
/**
 * GET USER BY ID (Protected)
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id) {
      const user = await userModel.findById(id, { password: 0 });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, user });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user by ID',
      error: err.message,
    });
  }
};

/**
 * SEARCH FOR USERS BY Email and Name (case insensitive)
 * GET /api/users/search/
 */
export const searchUser = async (req, res) => {
  try {
    const { userName, email } = req.body;

    if (!userName && !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user name or email to search',
      });
    }

    const query = {};

    if (email) {
      query.email = { $regex: email, $options: 'i' }; // Case-insensitive and allows partial matches
    }

    if (userName) {
      query.userName = { $regex: userName, $options: 'i' };
    }

    const users = await userModel.find(query, { password: 0 });

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: err.message,
    });
  }
};

/**
 * UPDATE USER
 * PUT /api/users/:id
 */
//
const rounds = parseInt(process.env.SALT_ROUND || 10);
const hashPhoneNumber = (phoneNumber) => {
  return crypto.createHash('sha256').update(phoneNumber).digest('hex');
};

function filterObject(obj, allowedFields) {
  const filtered = {};
  for (let key of allowedFields) {
    if (obj[key] !== undefined) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization: allow only the user or an admin
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    //  Prevent role manipulation
    if (req.user.role !== 'admin' && req.body.role) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your role',
      });
    }

    //  Validate input using Joi
    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        messages: error.details.map((err) => err.message),
      });
    }

    //  Whitelist only updatable fields
    const allowedFields = ['userName', 'phone', 'password', 'email'];
    const filteredBody = filterObject(value, allowedFields);

    //  Hash phone & password if present
    if (filteredBody.phone) {
      filteredBody.phone = hashPhoneNumber(filteredBody.phone);
    }

    if (filteredBody.password) {
      filteredBody.password = await bcrypt.hash(filteredBody.password, rounds);
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    //  Exclude password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('🔥 Error in updateUser:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: err.message,
    });
  }
};

/**
 * DELETE ALL USERS
 * DELETE /api/users
 * Only admin can perform this.
 */
export const deleteAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete all users',
      });
    }

    // This will remove all users whose role !== 'admin '
    const result = await userModel.deleteMany({ role: { $ne: 'admin' } });
    return res.status(200).json({
      success: true,
      message: 'All non-admin users deleted successfully',
      deletedCount: result.deletedCount, // optional info
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error deleting all users',
      error: err.message,
    });
  }
};
/**
 * DELETE USER BY ID (BY user or admin)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // If not admin, must be the same user
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user',
      });
    }

    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: err.message,
    });
  }
};

/**
 * TOGGLE USER VERIFICATION STATUS (BY ADMIN ONLY)
 * PATCH /api/users/:id/verification
 */
export const toggleVerification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = !user.isVerified; //  Toggle the value
    await user.save();
    //  Send a notification to the user about the verification status change
    const statusMessage = user.isVerified
  ? ' Your account has been verified! Please log out and log in again to access all features.'
  : ' Your account has been unverified (banned). You can no longer  access all features. Please contact support for more information.';

    const notification = new notificationModel({
      userId: user._id,
      message: statusMessage,
      type: 'verification',
      data: {
        isVerified: user.isVerified,
      },
    });
    await notification.save();

    const io = req.app.get('io');
    // * Emit an event to notify the user
    io.to(`user-${user._id}`).emit('userVerificationChanged', {
      userId: user._id,
      isVerified: user.isVerified,
      message: statusMessage,

    });

    res.status(200).json({
      success: true,
      message: `User verification status updated`,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error toggling verification', error: error.message });
  }
};
