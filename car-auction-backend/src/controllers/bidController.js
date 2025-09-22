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

  const bidsInfo = {
    bidId: newBid._id,
    bidderInfo: {
      avatar: newBid.bidderId.avatar,
      fullname: newBid.bidderId.fullname,
    },
    auctionId: newBid.auctionId,
    totalAmount: newBid.totalAmount,
    amount: newBid.amount,
  };

  console.log(bidsInfo);

  io.to(auctionId).emit('new-bid', {
    message: `Bid placed successfully! Raised by $${bidAmountNum}`,
    bidsInfo,
  });

  return res.status(201).json({
    message: `Bid placed successfully! Raised by $${bidAmountNum}`,
    bidsInfo,
  });
});

const getBidsOfAnAuction = asyncHandler(async (req, res) => {
  const { auctionID } = req.query;

  const bids = await Bid.find({ auctionId: auctionID })
    .populate('bidderId', 'fullname avatar email') // bring bidder info
    .sort({ createdAt: -1 });

  if (!bids) {
    throw new ApiError(
      500,
      'Something went wrong while finding the bids of auction'
    );
  }

  const bidsInfo = bids.map((bid) => ({
    bidId: bid._id,
    bidderInfo: {
      avatar: bid.bidderId.avatar,
      fullname: bid.bidderId.fullname,
    },
    auctionId: bid.auctionId,
    totalAmount: bid.totalAmount,
    amount: bid.amount,
  }));

  // console.log(bidsInfo);

  // console.log(bids.bidderId.avatar);
  // console.log(bids.bidderId.fullname);
  // console.log(bids.auctionId);
  // console.log(bids.amount);
  // console.log(bids.totalAmount);

  return res.status(200).json({
    message: 'These are all the bids',
    bidsInfo,
  });
});

module.exports = { newBid, getBidsOfAnAuction };
