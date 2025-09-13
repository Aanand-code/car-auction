const Auction = require('../models/Auction');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const postAuction = asyncHandler(async (req, res) => {
  //1 required data from frontend - sellerId, title, description, carImages, carVideo, category, year, startingPrize, currentPrize, status, startTime, endTime
  //2 required fields are available or not and throw error if not available
  //3 find user who place the bid - sellerId and other details
  //4 if not throw error of invalid access token
  //5 for now currentPrize = startingPrize
  //6 upload on cloudinary
  //7 create and save auction object
  //8 send this to other users via websocket also
  //9 send response back to user
  const io = req.app.get('io');

  const {
    title,
    description,
    category,
    year,
    startingPrice,
    status,
    startTime,
    endTime,
  } = req.body;

  //   console.log(
  //     `${title} ${description} ${category} ${year} ${startingPrice} ${status} ${startTime}`
  //   );

  if (
    !title ||
    !description ||
    !category ||
    !year ||
    !startingPrice ||
    !status ||
    !endTime
  ) {
    throw new ApiError(400, 'All important fields are required.');
  }

  const currentPrice = startingPrice;

  const sellerId = req.user._id;

  const auctioneerUser = await User.findById(sellerId).select('fullname');

  if (!auctioneerUser) {
    throw new ApiError(409, 'Unauthorized user or invalid access token');
  }
  //   console.log(auctioneerUser);

  //   console.log(req.files?.carImages[0]);
  //   const carImages = req.files?.carImages;
  const carImagesPaths = req.files?.carImages.map((carImage) => carImage.path);
  if (carImagesPaths.length === 0) {
    throw new ApiError(400, 'Pictures of car are required');
  }

  const carImages = await Promise.all(
    carImagesPaths.map(async (path) => {
      const result = await uploadOnCloudinary(path);
      return result.url;
    })
  );
  //   console.log(carImages);
  if (carImages.length === 0) {
    throw new ApiError(400, 'Some pictures of car are required');
  }

  const auction = await Auction.create({
    sellerId,
    title,
    carImages,
    description,
    category,
    year,
    startingPrice,
    currentPrice,
    status,
    startTime,
    endTime,
  });

  const newAuction = await Auction.findById(auction._id);

  if (!newAuction) {
    throw new ApiError(500, 'Something went wrong while creating new auction');
  }

  const newAuctionEmit = {
    message: 'New Auction',
    auctioneerUser,
    newAuction,
  };

  io.emit('new_auction', newAuctionEmit);

  res.status(201).json({
    message: 'Auction created successfully',
    auctioneerUser,
    newAuction,
  });
});

const getAuctions = asyncHandler(async (req, res) => {
  const allAuctions = await Auction.find();
  //.sort({ createdAt: -1 });
  // console.log(allAuctions);

  if (!allAuctions) {
    throw new ApiError(
      500,
      'Something went wrong while finding the auction details'
    );
  }

  if (allAuctions.length === 0) {
    res.status(200).json({
      message: 'There is no auction available at this time',
    });
  }

  const fullDetailsAuction = await Promise.all(
    allAuctions.map(async (auctionInfo) => {
      const sellerInfo = await User.findById(auctionInfo.sellerId).select(
        'avatar fullname'
      );

      return { sellerInfo, auctionInfo };
    })
  );

  if (!fullDetailsAuction) {
    throw new ApiError(
      500,
      'Something went wrong while finding the auction details'
    );
  }

  res.status(200).json({
    message: 'These are all auctions available',
    fullDetailsAuction,
  });
});

const auctionDetails = asyncHandler(async (req, res) => {
  //1 get auctionid
  //2 throw error if there is no auction
  //3 then get its start and end date compare the start to now date if it is in past the start date then change the status of that auction also check date now with end time if it is in past then also change the status
  //4 if the status is live then show all its bids if end then also show all its bid and if it is scheduled then show the auction is going to start in --timer

  const { auctionID } = req.query;
  // console.log('auctionId:', auctionID);

  //2 check auction existence
  const auction = await Auction.findById(auctionID);

  if (!auction) {
    throw new ApiError(400, 'There is no auction available with this id');
  }

  const auctioneer = await User.findById(auction.sellerId).select(
    'fullname avatar'
  );

  if (!auctioneer) {
    throw new ApiError(
      400,
      'Something went wrong while finding the auctioneer'
    );
  }

  res.status(200).json({
    message: 'These are the auction details',
    auctioneerInfo: auctioneer,
    auctionInfo: auction,
  });
});

// const myAuctionDetails = asyncHandler(async (req, res) => {
//   //1 my fullname avatar
// });

const myAuctions = asyncHandler(async (req, res) => {
  //1 my fullname avatar

  const userId = req.user;

  if (!userId) {
    throw new ApiError(400, 'Invalid user access token');
  }

  const user = await User.findById(userId).select('fullname avatar');

  if (!user) {
    throw new ApiError(400, 'Invalid user access token');
  }

  const auctions = await Auction.find({ sellerId: userId }).sort({
    created: -1,
  });

  if (auctions.length === 0) {
    res.status(200).json({
      message: 'There is no auction is available',
    });
  }

  res.status(200).json({
    message: 'Your auctions',
    user,
    auctions,
    count: auctions.length,
  });
});

module.exports = {
  postAuction,
  getAuctions,
  auctionDetails,
  // myAuctionDetails,
  myAuctions,
};
