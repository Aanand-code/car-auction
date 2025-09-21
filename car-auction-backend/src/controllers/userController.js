const User = require('../models/User.js');
const { generateOTP, verifyOTP } = require('../utils/otpManager.js');
const { sendOTPEmail } = require('../utils/mailer.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {
  //1 get user details from frontend
  //2 validation- not empty
  //3 check if user already exists: username, email
  //4 create user object - create entry in db
  //5 generate otp

  //1
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  //2
  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  //3
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }
  // console.log(req.file);
  //
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(existedUser);

  //4

  //5
  // console.log('User created:', user);
  const otp = generateOTP(email);
  // console.log(otp);

  await sendOTPEmail(email, otp);
  const user = await User.create({
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken -fullname -avatar -bio -location'
  );

  res.status(201).json({
    message:
      'Account created and One-Time Password (OTP) sent to your email to verify email',
    user: createdUser,
  });
});

const verifyUser = asyncHandler(async (req, res) => {
  //6 verify email
  //7 access and refresh token
  //8 remove password and refresh token field from response
  //9 check for user creation
  //10 send cookie and response
  const { email, otp: userProvidedOTP } = req.body;
  // console.log(email);
  // console.log(userProvidedOTP);

  if (!email || !userProvidedOTP) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  //6
  const verified = verifyOTP(email, userProvidedOTP);
  if (!verified) {
    throw new ApiError(
      400,
      'OTP expired or not found. Please request a new one.'
    );
  }

  const user = await User.findOne({
    email,
  });

  //8
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.isVerified = true;
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  //9
  const newUser = await User.findById(user._id).select(
    '-password -refreshToken -fullname -avatar -bio -location'
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  // 10
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      message: 'Email verified successfully',
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.fullname || '',
        avatar: newUser.avatar || '',
        bio: newUser.bio || '',
      },
      refreshToken,
    });
});

const login = asyncHandler(async (req, res) => {
  //1 get user details from frontend
  //2 validation not empty
  //3 check user exist
  //4 check if password is correct
  //5 access and refresh token
  //6 remove password and refreshtoken field
  //7 send cookie and response

  //1
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);
  // console.log('login req1');

  //2
  if (!email || !password) {
    throw new ApiError(400, 'Both user credentials required');
  }

  //3
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User does not exist');
  }

  //4
  // console.log(password);

  const isPasswordValid = await user.isPasswordCorrect(password);

  // console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(400, 'Password is invalid');
  }

  //5
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  //6
  const loggedUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  // console.log('login req2');

  //7
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      message: 'Logged in successfully',
      user: {
        _id: loggedUser._id,
        email: loggedUser.email,
        name: loggedUser.fullname || '',
        avatar: loggedUser.avatar || '',
        bio: loggedUser.bio || '',
      },
      accessToken,
      refreshToken,
    });
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', options)
    .cookie('refreshToken', options)
    .json({
      message: 'Logged out successfully',
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);
  // console.log(user);

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, 'Refresh token is expired or used');
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const accessToken = await user.generateAccessToken();
  // console.log('refresh token');

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .json({
      message: 'Access token refreshed',
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.fullname || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      },
    });
});

const avatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, 'No user found');
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is not found');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Could not upload avatar');
  }

  user.avatar = avatar.url;

  await user.save();

  res.status(201).json({
    message: 'Profile picture uploaded',
    avatar: avatar.url,
  });
});

const profileFields = asyncHandler(async (req, res) => {
  const { fullname, bio, city, state } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(400, 'No user found');
  }

  user.fullname = fullname;
  user.bio = bio;
  user.city = city;
  user.state = state;

  await user.save();

  res.status(201).json({
    message: 'New fields are created',
    user: user,
  });
});

const updateName = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(400, 'No user found');
  }
  const { name: fullname } = req.body;

  if (fullname.trim() === '') {
    throw new ApiError(400, 'Atleast write some name');
  }

  user.fullname = fullname;
  await user.save();

  res.status(201).json({
    message: 'New fields are created',
    name: user.fullname,
  });
});

const updateBio = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(400, 'No user found');
  }

  const { bio } = req.body;

  if (bio.trim() === '') {
    throw new ApiError(400, 'Atleast write something');
  }

  user.bio = bio;
  await user.save();

  res.status(201).json({
    message: 'New fields are created',
    bio: user.bio,
  });
});

module.exports = {
  signup,
  verifyUser,
  login,
  logout,
  refreshAccessToken,
  avatar,
  profileFields,
  updateName,
  updateBio,
};
