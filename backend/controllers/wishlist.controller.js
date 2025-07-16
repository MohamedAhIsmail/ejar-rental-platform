import userModel from "../models/user.model.js";
import mongoose from "mongoose";

//  Get the user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err.message });
  }
};

//  Add product to wishlist (via  param)
export const addToWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist', error: err.message });
  }
};

// Remove product from wishlist (via  param)
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: err.message });
  }
};

//  Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { wishlist: [] },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear wishlist', error: err.message });
  }
};
