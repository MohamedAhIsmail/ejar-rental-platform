import { Schema, model } from 'mongoose';

const processSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    renterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Start date must be in the future',
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'canceled', 'in progress', 'finished'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

processSchema.pre('save', function (next) {
  const today = new Date();

  if (this.status === 'canceled') {
    return next();
  }

  if (this.startDate <= today && this.endDate >= today) {
    this.status = 'in progress';
  }

  if (this.endDate < today) {
    this.status = 'finished';
  }

  next();
});

const processModel = model('Process', processSchema);

export default processModel;
