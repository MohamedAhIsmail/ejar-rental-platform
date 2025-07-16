import userModel from '../models/user.model.js';
import * as bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

//  hash phone numbers for comparison with the hashed phone in the database when login using the phone
const rounds = parseInt(process.env.SALT_ROUND);
const hashPhoneNumber = (phoneNumber) => {
  return crypto.createHash('sha256').update(phoneNumber).digest('hex');
};

const register = async (req, res) => {
  try {
    const frontPath = req.files?.idPictureFront?.[0]?.path || '';
    const backPath = req.files?.idPictureBack?.[0]?.path || '';
    const {
      userName,
      email,
      password,
      confirmedPassword,
      role,
      phone,
      dob,
      address,
      idNumber,
      gender,
    } = req.body;

    if (password !== confirmedPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match' });
    }

    if (await userModel.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }
    if (await userModel.findOne({ idNumber })) {
      return res
        .status(400)
        .json({ success: false, message: 'This National ID already exists' });
    }

    if (await userModel.findOne({ phone: hashPhoneNumber(phone) })) {
      return res
        .status(400)
        .json({ success: false, message: 'Phone number already exists' });
    }

    if (role === 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'You cannot register as an admin.' });
    }

    const hashPassword = bcrypt.hashSync(password, rounds);
    const hashedPhone = hashPhoneNumber(phone);

    const user = await userModel.create({
      userName,
      email,
      password: hashPassword,
      phone: hashedPhone,
      dob,
      address,
      idNumber,
      gender,
      idPictureFrontPath: frontPath,
      idPictureBackPath: backPath,
      role: 'user', //  always "user"
      isVerified: false,
    });

    const objectUser = user.toObject();
    delete objectUser.password;
    //  Generate email verification token

    const token = jwt.sign({ id: user._id }, process.env.CONFIRM_EMAIL_TOKEN, {
      expiresIn: '1d',
    });
    const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/auth/verify/${token}`;
    console.log(url);
    sendEmail(
      objectUser.email,
      'Email Confirmation Request',
      url,
      'confirm',
      objectUser.userName
    );

    res.status(200).json({
      message: 'User registered successfully',
      objectUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let query;

    // Check if identifier is phone or email
    if (/^\d{11}$/.test(identifier)) {
      query = { phone: hashPhoneNumber(identifier) };
    } else {
      query = { email: identifier };
    }

    // Find user by email OR hashed phone
    const user = await userModel.findOne(query);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist. Please register first.' });
    }

    console.log('✅ User found. Checking password...');
    //  Optional: Require email confirmation before login
    //  if (!user.confirmEmail) {
    //     return res.status(403).json({ message: "Please verify your email before logging in." });
    //   }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, isVerified: user.isVerified },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '20h' }
    );

    return res
      .status(200)
      .json({
        message: 'Login successful.',
        token,
        isVerified: user.isVerified,
      });
  } catch (error) {
    console.error('🔥 Internal Server Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    // Extract token from request params
    const { token } = req.params;
    if (!token) {
      return res.status(400).send('Token is required');
    }

    const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN);

    // Update user email confirmation status
    const user = await userModel.findOneAndUpdate(
      { _id: decoded.id },
      { confirmEmail: true },
      { new: true } // Return updated document
    );
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(`
     <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verified</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow: hidden;
        }

        .content {
          text-align: center;
          max-width: 600px;
          padding: 20px;
          animation: fadeIn 1.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 38px;
          font-weight: 700;
          color: #562DDD;
          margin-bottom: 15px;
        }

        p {
          font-size: 18px;
          color: #333;
          margin-bottom: 10px;
        }

        .btn {
          display: inline-block;
          background: linear-gradient(90deg, #562DDD, #7e5aff);
          color: white;
          text-decoration: none;
          padding: 14px 36px;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          margin-top: 30px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(86, 45, 221, 0.3);
        }

        .btn:hover {
          background: linear-gradient(90deg, #3f20b9, #6e4ee9);
          box-shadow: 0 6px 18px rgba(86, 45, 221, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="confetti"></div>
      <div class="content">
        <h1>Email Verified ✅</h1>
        <p>Welcome aboard! </p>
        <p>Your email has been successfully verified.</p>
        <p>We're thrilled to have you with us.</p>
        <p>Click below to start your journey:</p>
        <a href="http://localhost:5173/login" class="btn">Go to Website</a>
      </div>
    </body>
    </html>`);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).send('Token is not valid');
    }
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

export { register, login, verifyEmail };
