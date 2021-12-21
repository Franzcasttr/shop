const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { checkpermisions } = require("../utils");
const createReview = async (req, res) => {
  const { product: productID } = req.body; //product ID ito yung ilalagay para hindi maging undefined yung product sa model
  const isProductValid = await Product.findOne({ _id: productID });
  if (!isProductValid) {
    throw new CustomError.NotFoundError(`No product with id ${review}`);
  }

  const isAlreadySubmitted = await Review.findOne({
    product: productID,
    user: req.body.userID,
  });
  if (isAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You already post a review to this product"
    );
  }
  req.body.user = req.user.userID;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReview = async (req, res) => {
  const review = await Review.find({}).populate({
    path: "product", //eto yung nasa review model na product na nasa ibang model
    select: "name company price", //eto yung laman ng product
  });
  res.status(StatusCodes.OK).json({ review, count: review.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewID } = req.params;
  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewID}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewID } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewID}`);
  }

  checkpermisions(req.user, review.rating);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewID } = req.params;
  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewID}`);
  }
  checkpermisions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review has been removed" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productID } = req.params;
  const reviews = await Review.find({ product: productID });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
