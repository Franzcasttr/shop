const {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");
const {
  authenticateuser,
  authorizePermission,
} = require("../middleware/authentication");

const reviewRoutes = require("express").Router();

reviewRoutes.route("/").post(authenticateuser, createReview).get(getAllReview);

reviewRoutes
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateuser, updateReview)
  .delete(authenticateuser, deleteReview);

module.exports = reviewRoutes;
