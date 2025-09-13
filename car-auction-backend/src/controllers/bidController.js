const Auction = require('../models/Auction');
const User = require('../models/User');
const Bid = require('../models/Bid');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');

const newBid = asyncHandler(async (req, res) => {
  // console.log('hello');

  const io = req.app.get('io');
  const userId = req.user;
  const { auctionId, bidAmount } = req.body;

  const user = await User.findById(userId).select('avatar username fullname');
  const auction = await Auction.findById(auctionId);

  if (!user) {
    throw new ApiError('There is no user with this ID');
  }
  if (!auction) {
    throw new ApiError(400, 'There is no auction with this ID');
  }
  if (auction.status !== 'LIVE') {
    throw new ApiError(400, 'Auction is not live');
  }
  if (auction.sellerId.toString() === userId.toString()) {
    throw new ApiError(400, 'You cannot bid on your own auction');
  }

  const currentPrice = Number(auction.currentPrice);
  const bidAmountNum = Number(bidAmount);

  const allowedRaises = [25000, 50000, 75000, 100000];
  if (!allowedRaises.includes(bidAmountNum)) {
    throw new ApiError(
      400,
      `Bid raise must be one of: ${allowedRaises.join(', ')}`
    );
  }

  const newCurrentPrice = currentPrice + bidAmountNum;

  auction.currentPrice = newCurrentPrice;
  auction.currentBidder = userId;

  await auction.save();

  const bid = await Bid.create({
    bidderId: userId,
    auctionId: auctionId,
    amount: bidAmount,
    totalAmount: newCurrentPrice,
  });

  const newBid = await Bid.findById(bid._id).populate(
    'bidderId',
    'username avatar fullname'
  );
  if (!newBid) {
    throw new ApiError(500, 'Something wrong while creating new bid');
  }

  res.status(201).json({
    message: `Bid placed successfully! Raised by $${bidAmountNum}`,
    newBid: newBid,
    user: user,
    raiseAmount: bidAmountNum,
    auction: {
      id: auction._id,
      title: auction.title,
      currentPrice: newCurrentPrice,
    },
  });
});

module.exports = { newBid };
