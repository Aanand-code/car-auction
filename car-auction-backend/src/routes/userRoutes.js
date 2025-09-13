const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multerMiddleware.js');
const {
  signup,
  verifyUser,
  login,
  logout,
  refreshAccessToken,
  avatar,
  updateName,
  updateBio,
} = require('../controllers/userController.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');

router.get('/hello', (req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});
// upload.single('avatar'),

router.post('/signup', signup);
router.post('/verifyUser', verifyUser);
router.post('/login', login);

//Secured Routes
router.post('/avatar', verifyJWT, upload.single('avatar'), avatar);
router.post('/logout', verifyJWT, logout);
router.post('/update-name', verifyJWT, updateName);
router.post('/update-bio', verifyJWT, updateBio);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
