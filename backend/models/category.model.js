import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [15, "Category name cannot exceed 15 characters"],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name = update.name.toLowerCase();
    this.setUpdate(update);
  }
  next();
});

const CategoryModel = model("Category", categorySchema);

export default CategoryModel;
