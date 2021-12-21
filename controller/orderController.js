const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { checkpermisions } = require("../utils");

const fakePayment = async ({ amount, currency }) => {
  const client_secret = "somethingvalue";
  return { client_secret, amount };
};
const CreateOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.NotFoundError("Not cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.NotFoundError("Please provide tax and shipping fee");
  }
  let OrderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    //titignan nya yung laman ng cartItems gagawa sya ng loop
    const dbProduct = await Product.findOne({ _id: item.product }); //item.product is nasa req.body yun cartItems den choose prooduct tapos yung id(productid)
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product  with id ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItems = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    //add item to order
    OrderItems = [...OrderItems, singleOrderItems];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  //calculate total
  const total = tax + shippingFee + subtotal;
  //get client secret
  const paymentItent = await fakePayment({ amount: total, currency: "usd" });
  const order = await Order.create({
    OrderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentItent.client_secret,
    user: req.user.userID,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, cleintSecret: order.client_secret });
};
const getAllOrder = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: OrderID } = req.params;
  const order = await Order.findOne({ _id: OrderID });
  if (!order) {
    throw new CustomError.NotFoundError(`No oder with id: ${OrderID}`);
  }
  checkpermisions(req.user, order.user);

  res.status(StatusCodes.OK).json({ Order: order });
};
const updateOrder = async (req, res) => {
  const { id: OrderID } = req.params;
  const { paymentItentID } = req.body;
  const order = await Order.findOne({ _id: OrderID });
  if (!order) {
    throw new CustomError.NotFoundError(`No oder with id: ${OrderID}`);
  }
  checkpermisions(req.user, order.user);

  order.paymentItentId = paymentItentID;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};
const allorder = async (req, res) => {
  const order = await Order.find({ user: req.user.userID });

  res.status(StatusCodes.OK).json({ order, count: order.length });
};

module.exports = {
  getAllOrder,
  getSingleOrder,
  allorder,
  CreateOrder,
  updateOrder,
};
