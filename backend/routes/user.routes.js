import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {getAllUsers,getUserById,updateUser, deleteAllUsers, deleteUser, searchUser, toggleVerification,} from '../controllers/user.controller.js';
import { getProfilePicture, updateProfilePicture,} from '../controllers/updateProfilePicture.controller.js';
import cloudinaryUpload from '../middleware/cloudinaryUpload.middleware.js';

// import { requireVerification } from '../middleware/verification.middleware.js';  //  Only verified users can do etc..
// middleware after authMiddleware //  to check if the user is verified before allowing access to certain routes(requireVerification)

const userRoutes = Router();

// Route to update user profile picture
// This route is protected by the authMiddleware, meaning only logged-in users can access it as the rest
userRoutes.put(
  '/upload-profile-picture',
  authMiddleware,
  cloudinaryUpload.single('profilePicture'),
  updateProfilePicture
);
userRoutes.get('/profile-picture', authMiddleware, getProfilePicture);
userRoutes.get('/', authMiddleware, getAllUsers);
userRoutes.get('/:id', authMiddleware,getUserById);
userRoutes.post('/search', authMiddleware, searchUser);
userRoutes.put('/:id', authMiddleware, updateUser);
userRoutes.delete('/', authMiddleware, deleteAllUsers);
userRoutes.delete('/:id', authMiddleware, deleteUser);

// Route to toggle user verification status by Admin Only
userRoutes.patch('/toggle-verification/:id', authMiddleware, toggleVerification);


export default userRoutes;
