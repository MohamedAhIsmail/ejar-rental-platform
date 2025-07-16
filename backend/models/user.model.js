import { model, Schema } from 'mongoose';
const roleType = {
  user: 'user',
  admin: 'admin',
};

const userSchema = new Schema({
  userName: { type: String, required: [true, 'UserName field is required'],
    minlength: 3,
    maxlength: 30,
  },
  email:    { type: String, required: [true, 'Email is required'], unique: true },
  confirmEmail: { type: Boolean, default: false, },
  password: { type: String, required: [true, 'Password is required'] },

  phone:    { type: String, required: [true, 'Phone number is required'], unique: true },
  // Stored as a SHA-256 hash for privacy/security reasons

  dob:      { type: String, required: [true, 'Date of Birth is required'] },
  address:  { type: String, required: [true, 'Address is required'] },
  idNumber: { type: String, required: [true, 'Nation Id number is required'], unique: true },
  gender:   { type: String, enum: ['male', 'female'], required: true },
  isVerified: { type: Boolean, default: false }, 

  role: {
    type: String,
    enum: Object.values(roleType), // Retrieve all values from the roleType object
    default: roleType.user,
  }, 
  profilePicture: { type: String, default: "https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg" ,
  },

  
  // If you want to store file paths for images:
  idPictureFrontPath: {
  type: String,
  required: [true, 'Front side of national ID is required'],
},
idPictureBackPath: {
  type: String,
  required: [true, 'Back side of national ID is required'],
},
// wishlist is an array of ObjectId references to the Product model
wishlist: [
  {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
],


  resetPasswordToken: String,
  resetPasswordExpires: Date, // Expiry time for the reset token
 
},
{ timestamps: true },
);

const userModel = model('User', userSchema);
export default userModel;