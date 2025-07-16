import mongoose, { Schema } from "mongoose";

const reviewShema = new mongoose.Schema({
   
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        default: 0,
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
    },
    prodid:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required: [true, 'Product ID is required'],

    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

}, { timestamps: true });

const reviewModel = mongoose.model('Reviews', reviewShema);
export default reviewModel;

