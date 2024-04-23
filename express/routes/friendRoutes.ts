import express from 'express'
import {
	acceptFriendRequest,
	cancelFriendRequest,
	deleteAllRejectedRequest,
	getFriendListByID,
	getMyFriendList,
	getPendingFriendRequests,
	getSendingFriendRequests,
	sendFriendRequest,
} from '../controllers/friendController'
import { isAuthenticated } from '../middleware/auth'

const router = express.Router()
// request
router.route('/request').post(isAuthenticated, sendFriendRequest)
router.route('/accept').post(isAuthenticated, acceptFriendRequest)
router.route('/cancel').post(isAuthenticated, cancelFriendRequest)
// get
router.route('/pending').get(isAuthenticated, getPendingFriendRequests)
router.route('/sending').get(isAuthenticated, getSendingFriendRequests)
router.route('/my').get(isAuthenticated, getMyFriendList)
router.route('/:id').get(isAuthenticated, getFriendListByID)
// delete
router.route('/delete').delete(isAuthenticated, deleteAllRejectedRequest)

export default router
