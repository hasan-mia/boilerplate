import express from 'express'
import {
	deleteUser,
	forgotPassword,
	getUserDetails,
	imageUpload,
	loginUser,
	logout,
	registerUser,
	resetPassword,
	updatePassword,
	updateProfile,
} from '../controllers/userController'
import { isAuthenticated, isAuthorizeRoles } from '../middleware/auth'

const router = express.Router()

router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset').put(resetPassword)

router.route('/logout').get(logout)
router.route('/me').get(isAuthenticated, getUserDetails)
router.route('/password/update').put(isAuthenticated, updatePassword)
router.route('/me/update').put(isAuthenticated, updateProfile)

// delete user
router
	.route('/me/update')
	.delete(isAuthenticated, isAuthorizeRoles('admin', 'super_admin'), deleteUser)

// file upload
router.route('/upload').post(imageUpload)

export default router
