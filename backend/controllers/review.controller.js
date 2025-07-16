import product from "../models/Product.model.js";
import reviewModel from "../models/reviews.model.js";
import userModel from "../models/user.model.js";


const getAllReviews = async (req, res) => {
  try {
    const allReviews = await reviewModel
      .find()
      .populate("createdBy", "userName") 
      .populate("prodid", "name"); 

    res.status(200).json({ allReviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getReviewById = async (req, res) => {
  const { id: reviewId } = req.params;

  try {
    const foundedReview = await reviewModel.find({createdBy:reviewId})      
    .populate("createdBy", "userName") 
    .populate("prodid", "name"); 
;
    if (!foundedReview) {
      return res
        .status(404)
        .json({ status: "fail", message: "invalid review id" });
    }  
      res.status(200).json({ foundedReview });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




const createReview = async (req, res) => {
  try {
    const { id: userid } = req.user;
    const user = await userModel.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const { rating, comment, prodid } = req.body;

    if (!rating ) {
      return res.status(400).json({ message: "Please complete all fields" });
    }

    if ( !comment) {
      return res.status(400).json({ message: "Please add a comment" });
    }

    if (!prodid) {
      return res.status(400).json({ message: "Please add a product ID" });
    }

    // Check if the product exists
    const foundproduct = await product.findById(prodid);
    if (!foundproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviewAdded = await reviewModel.create({
      rating,
      comment,
      createdBy: userid,
      prodid
    });

    return res.status(201).json({ review: reviewAdded });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


  //TODO: check if it is the user who created the review

const updateReview = async (req, res) => {

  const { id: reviewId } = req.params;

  const { id: userid } = req.user;

  const { rating, comment } = req.body;

  try {

      const authUser= await reviewModel.findOne({createdBy:userid})

      if (!authUser) {
        return res.status(401).json({ message: "you are not authorized" });
      }

    const foundedReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );

    if (!foundedReview) {
      return res.status(400).json({ message: "review not founded" });
    } else {
      return res.status(200).json({ foundedReview });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getAllReviews, getReviewById, createReview, updateReview };
