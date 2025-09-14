const express = require('express');
const { verifyJWT } = require('../middleware/authMiddleware');
const router = express.Router();
const { upload } = require('../middleware/multerMiddleware.js');
const {
  postAuction,
  getAuctions,
  auctionDetails,
  myAuctionDetails,
  myAuctions,
} = require('../controllers/auctionController.js');

router.post(
  '/post-auction',
  verifyJWT,
  upload.array('carImages', 10),
  postAuction
);

router.get('/auctions', verifyJWT, getAuctions);
router.get('/auction-details', verifyJWT, auctionDetails);
// router.get('/my-auction-details', verifyJWT, myAuctionDetails);
router.get('/my-auctions', verifyJWT, myAuctions);

module.exports = router;
