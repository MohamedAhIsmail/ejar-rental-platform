import { Schema, model } from 'mongoose';

const chatSchema = new Schema(
  {
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const chatModel = model('Chat', chatSchema);

export default chatModel;
