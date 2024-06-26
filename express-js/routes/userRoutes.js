const express = require('express')
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  imageUpload,
  deleteUser,
  getAllUser,
} = require('../controllers/userController')
const {
  isAuthenticated,
  isAuthorizeRoles,
} = require('../middleware/auth')

const router = express.Router()

router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset').put(resetPassword)

router.route('/logout').get(logout)
router.route('/me').get(isAuthenticated, getUserDetails)
router.route('/password/update').put(isAuthenticated, updatePassword)
router.route('/me/update').put(isAuthenticated, updateProfile)

// get all user
router.route('/users').get(getAllUser)

// delete user
router.route('/me/update').delete(isAuthenticated, isAuthorizeRoles('admin, super_admin'), deleteUser)

// file upload
router.route('/upload').post(imageUpload)


// Route handler to emit a socket event
router.post('/socket', (req, res) => {
   const io = req.app.get('io'); 

  if (io) {
    io.emit('some-event', { message: req.body });
    res.send('Socket event emitted');
  } else {
    res.status(500).json({ success: false, message: 'Socket.IO is not properly configured' });
  }
});


module.exports = router
