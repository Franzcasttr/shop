const {
  getAllOrder,
  getSingleOrder,
  CreateOrder,
  updateOrder,
  allorder,
} = require("../controller/orderController");
const {
  authenticateuser,
  authorizePermission,
} = require("../middleware/authentication");

const orderRoutes = require("express").Router();

orderRoutes
  .route("/")
  .get(authenticateuser, authorizePermission("admin"), getAllOrder)
  .post(authenticateuser, CreateOrder);
orderRoutes.route("/showmyorders").get(authenticateuser, allorder);
orderRoutes
  .route("/:id")
  .get(authenticateuser, getSingleOrder)
  .patch(authenticateuser, updateOrder);

module.exports = orderRoutes;
