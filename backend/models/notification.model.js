import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['verification', 'message', 'system', 'product_confirmation'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const notificationModel = model('Notification', notificationSchema);

export default notificationModel;
