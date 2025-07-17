export interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  confirmEmail: boolean;
  dob: string;
  address: string;
  idNumber: string;
  gender: string;
  createdAt: string;
  // optional bec if user hasn't uploaded profile picture yet
  profilePicture?: string;

  idPictureFrontPath: string;
  idPictureBackPath: string;
   isVerified?: boolean; 
}
