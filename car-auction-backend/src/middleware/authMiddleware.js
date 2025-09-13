const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

const verifyJWT = asyncHandler(async (req, res, next) => {
  // console.log('verify req');

  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');
  // console.log(token);

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }
  // console.log('token then');

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired');
    }
    throw new ApiError(401, 'Invalid access token');
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password, -refreshToken'
  );
  // console.log(user);

  if (!user) {
    throw new ApiError(401, 'Invalid access token');
  }

  req.user = user;
  next();
});

module.exports = { verifyJWT };
