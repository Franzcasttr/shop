const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userID; //req.body.user ay nasa product model tapos ang req.user.userID ay nasa cookies
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProduct = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ product, count: product.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productID}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productID}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productID}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "success product removed" });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file Uploaded");
  }
  const imageFile = req.files.image;
  if (!imageFile.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }

  const maxsize = 1024 * 1024;

  if (imageFile.size > maxsize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }
  //   console.log(imageFile);
  const imagepath = path.join(
    __dirname,
    "../public/uploads/" + `${imageFile.name}`
  );
  imageFile.mv(imagepath);

  res.status(StatusCodes.CREATED).json({ image: `/uploads/${imageFile.name}` });
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
