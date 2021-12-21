const {
  authenticateuser,
  authorizePermission,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");
const { getSingleProductReviews } = require("../controller/reviewController");
const router = require("express").Router();

router
  .route("/")
  .post([authenticateuser, authorizePermission("admin")], createProduct)
  .get(getAllProduct);

router
  .route("/uploadimage")
  .post([authenticateuser, authorizePermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateuser, authorizePermission("admin")], updateProduct)
  .delete([authenticateuser, authorizePermission("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
