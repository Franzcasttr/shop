const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const {
  createTokeUser,
  attachCookiesToResponce,
  checkpermisions,
} = require("../utils");
const getAllusers = async (req, res) => {
  console.log(req.user);
  const result = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ result });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }
  checkpermisions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
//update user with findoneandupdate
// const updateUser = async (req, res) => {
//     const { name, email } = req.body
//     if (!name || !email) {
//         throw new CustomError.BadRequestError('Please provide email/name')
//     }
//     const user = await User.findOneAndUpdate({ _id: req.user.userID }, { email, name }, { new: true, runValidators: true })

//     const tokenUser = createTokeUser(user)
//     attachCookiesToResponce({ res, user: tokenUser })
//     res.status(StatusCodes.OK).json({ user: tokenUser })
// }

//update user with user.save
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide email/name");
  }
  const user = await User.findOne({ _id: req.user.userID });
  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokeUser(user);
  attachCookiesToResponce({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { OldPassword, newPassword } = req.body;
  if (!OldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide password");
  }
  const user = await User.findOne({ _id: req.user.userID });
  const isPasswordCorrect = await user.comparePassword(OldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success!" });
};

module.exports = {
  getAllusers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
