const express = require("express");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const router = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
require("dotenv").config();
require("express-async-errors");
// rest of packages
const cookieparser = require("cookie-parser");
const fileupload = require("express-fileupload");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

app.use(express.static("./public"));
app.use(fileupload());
app.use(express.json());
app.use(cookieparser(process.env.JWT_SECRET));
app.set("trust proxy", 1);
app.use(ratelimit({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

//Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", router);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

//middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

//db
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening to port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
