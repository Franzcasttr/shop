const {
  getAllusers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/UserController");
const {
  authenticateuser,
  authorizePermission,
} = require("../middleware/authentication");
const router = require("express").Router();

router
  .route("/")
  .get(authenticateuser, authorizePermission("admin"), getAllusers);

router.route("/showme").get(authenticateuser, showCurrentUser);
router.route("/updateuser").patch(authenticateuser, updateUser);
router.route("/updateuserpassword").patch(authenticateuser, updateUserPassword);
router.route("/:id").get(authenticateuser, getSingleUser);

module.exports = router;
