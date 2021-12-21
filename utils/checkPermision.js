const CustomError = require("../errors");
const checkpermisions = (requestUser, resourceUserId) => {
  // console.log(requestUser); (req.user) eto yung nasa cookies or naka sa jwt
  // console.log(resourceUserId); (user._id)
  // console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return; //return is good to go
  if (requestUser.userID === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "You are not allowed to view this route"
  );
};

module.exports = checkpermisions;
