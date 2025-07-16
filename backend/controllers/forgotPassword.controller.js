import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found. Please register first." });
    }
    
    //  Generate a password reset token
    if (!process.env.RESET_PASSWORD_SECRET) {
      return res.status(500).json({ message: "Internal Server Error: Missing secret key." });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "1h" }
    );

    // reset URL
    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

    console.log("📧 Sending reset link to:", user.email);
    console.log("🔗 Reset URL:", resetUrl);

    //  Send reset link via email
    await sendEmail(user.email, "Password Reset Request", resetUrl, "reset", user.userName);

    return res.status(200).json({ message: "Password reset link sent! Check your email." });

  } catch (error) {
    console.error("🔥 Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
