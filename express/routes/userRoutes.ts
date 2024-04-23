import express from 'express'
import {
	deleteUser,
	updateContactInfo,
	updatePassword,
	updateProfile,
	userAll,
	userInfoByID,
} from '../controllers/userController'
import { isAuthenticated } from '../middleware/auth'

const router = express.Router()

// update user
router.route('/update-password').put(isAuthenticated, updatePassword)
router.route('/update-profile').put(isAuthenticated, updateProfile)
router.route('/update-contact').put(isAuthenticated, updateContactInfo)
// get user
router.route('/:id').get(userInfoByID)
router.route('/all').get(isAuthenticated, userAll)
// delete user
router.route('/delete/:id').delete(isAuthenticated, deleteUser)

export default router
