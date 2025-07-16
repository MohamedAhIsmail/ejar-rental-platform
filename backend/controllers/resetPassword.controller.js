import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const rounds = parseInt(process.env.SALT_ROUND || 10);


    // Verify the token
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user does not exist." });
    }
    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, rounds);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "✅ Password reset successful! You can log in now." });

  } catch (error) {
    console.error("🔥 Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { resetPassword };
