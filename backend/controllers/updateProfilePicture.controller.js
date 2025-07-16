import userModel from "../models/user.model.js";

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No profile picture uploaded",
      });
    }
    const profileUrl = req.file.secure_url || req.file.path || req.file.url;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profileUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicturePath: profileUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: err.message,
    });
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile picture",
      error: err.message,
    });
  }
};
