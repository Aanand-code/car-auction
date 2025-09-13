const express = require('express');
const router = express.Router();
const { newBid } = require('../controllers/bidController');
const { verifyJWT } = require('../middleware/authMiddleware');

router.post('/new-bid', verifyJWT, newBid);


module.exports = router;
