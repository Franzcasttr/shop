const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
// const bcrypt = require('bcryptjs')
const { attachCookiesToResponce, createTokeUser } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Email Already Exist");
  }
  //first registered user is admin
  // const isFirstAccount = (await User.countDocuments({})) === 0;
  // const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password });
  const tokenUser = createTokeUser(user);
  //naka refractor na to nasa utils na folder
  // const token = createJWT({ payload: tokenUser })
  // const oneday = 1000 * 60 * 60 * 24
  // res.cookie('token', token, { expires: new Date(Date.now() + oneday), httpOnly: true })
  attachCookiesToResponce({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ users: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokeUser(user);
  attachCookiesToResponce({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ users: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = { register, login, logout };
