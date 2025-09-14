const express = require('express');
const router = express.Router();
const { newBid, getBidsOfAnAuction } = require('../controllers/bidController');
const { verifyJWT } = require('../middleware/authMiddleware');

router.post('/new-bid', verifyJWT, newBid);
router.get('/get-bids', verifyJWT, getBidsOfAnAuction);

module.exports = router;
