const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponce = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneday = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    expires: new Date(Date.now() + oneday),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponce };
