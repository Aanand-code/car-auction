const mongoose = require('mongoose');
const { ApiError } = require('../utils/ApiError');
const { Schema, model } = mongoose;

const auctionSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    carImages: {
      type: [String],
      default: [],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [ 'SCHEDULED', 'LIVE', 'ENDED', 'SOLD', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    currentBidder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    finalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.pre('save', function (next) {
  if (typeof this.startingPrice === 'string') {
    this.startingPrice = Number(this.startingPrice);
  }
  if (typeof this.currentPrice === 'string') {
    this.currentPrice = Number(this.currentPrice);
  }
  if (typeof this.year === 'string') {
    this.year = Number(this.year);
  }

  if (this.startTime && typeof this.startTime === 'string') {
    this.startTime = new Date(this.startTime);
  }
  if (this.endTime && typeof this.endTime === 'string') {
    this.endTime = new Date(this.endTime);
  }

  if (isNaN(this.startingPrice)) {
    return next(new ApiError(400, 'Starting price must be a valid number'));
  }
  if (isNaN(this.currentPrice)) {
    return next(new ApiError(400, 'Current price must be a valid number'));
  }
  if (isNaN(this.year)) {
    return next(new ApiError(400, 'Manufactured year must be a valid number'));
  }

  if (this.startTime && isNaN(this.startTime.getTime())) {
    return next(new ApiError(400, 'Invalid start time date'));
  }
  if (this.endTime && isNaN(this.endTime.getTime())) {
    return next(new ApiError(400, 'Invalid end time date'));
  }

  if (this.currentPrice < this.startingPrice) {
    this.currentPrice = this.startingPrice;
  }
  if (this.startTime >= this.endTime) {
    throw new ApiError(400, 'End time must be after start time.');
  }

  if (this.startTime <= new Date()) {
    throw new ApiError(400, 'Start time must be in the future.');
  }

  next();
});


auctionSchema.methods.updateStatus = function () {
  const now = new Date();
  
}

const Auction = model('Auction', auctionSchema);
module.exports = Auction;
