import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      required: true,
      default: "available",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmMessage: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      required: true,
      default: "brand",
    },
    rentedFor: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    daily: {
      type: Number,
      required: true,
    },
    weekly: {
      type: Number,
    },
    monthly: {
      type: Number,
    },

    images: {
      type: [String],
      validate: [arrayLimit, "You can upload up to 4 images only"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);
function arrayLimit(val) {
  return val.length <= 4;
}

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" }).populate({
    path: "renterId",
    select: " userName  _id",
  });
  next();
});

productSchema.pre("save", function (next) {
  if (this.daily) {
    this.weekly = this.daily * 7;
    this.monthly = this.daily * 30;
  }
  next();
});

productSchema.virtual("review", {
  ref: "Reviews",
  foreignField: "prodid",
  localField: "_id",
});
productSchema.virtual("averageRating").get(function () {
  if (!this.review || this.review.length === 0) return 0;

  const totalRating = this.review.reduce((sum, rev) => sum + rev.rating, 0);
  return Math.round(totalRating / this.review.length);
});

const product = model("Product", productSchema);

export default product;
