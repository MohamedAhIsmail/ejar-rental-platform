import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/Product.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const newCategory = new CategoryModel({
      name,
      icon,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.status(200).json({
      success: true,
      data: categories,
      message: "All Categories",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Categories not found",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // related items
    const products = await ProductModel.find({ category: category._id });
    const results = products.length;
    res.status(200).json({
      success: true,
      data: {
        ...category._doc,
        products,
        results,
      },
      message: "Category found with products",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category not found",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required and cannot be empty",
      });
    }

    const { name, icon } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (icon !== undefined) updateFields.icon = icon.trim();

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
  }
};
