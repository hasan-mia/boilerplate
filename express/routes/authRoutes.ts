import express from 'express'
import {
	forgotPassword,
	loginUser,
	myInfo,
	registerUser,
	resetPassword,
} from '../controllers/authController'
import { isAuthenticated } from '../middleware/auth'

const router = express.Router()

// register/login
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
// reset pass
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').put(resetPassword)
// my info
router.route('/me').get(isAuthenticated, myInfo)

export default router
