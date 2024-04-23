import { NextFunction, Request, Response } from 'express'
import catchAsyncError from '../middleware/catchAsyncError'
import FriendModel from '../models/friendModel'
import UserModel from '../models/userModel'
import ErrorHandler from '../utils/errorhander'

export const sendFriendRequest = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fromUser = req.user.id
			const { toUser } = req.body

			const existingRequest = await FriendModel.findOne({
				fromUser,
				toUser,
				status: 'pending',
			})

			if (existingRequest) {
				throw new ErrorHandler('Friend request already sent', 400)
			}

			// Check if the users are already friends
			const fromUserDoc = await UserModel.findById(fromUser).exec()
			const toUserDoc = await UserModel.findById(toUser).exec()

			if (!fromUserDoc || !toUserDoc) {
				throw new ErrorHandler('User not found', 404)
			}

			if (
				(fromUserDoc.friends && fromUserDoc.friends.includes(toUser)) ||
				(toUserDoc.friends && toUserDoc.friends.includes(fromUser))
			) {
				throw new ErrorHandler('Users are already friends', 400)
			}

			// send friend request
			const friendRequest = await FriendModel.create({ fromUser, toUser })

			if (!friendRequest) {
				throw new ErrorHandler('Faild sent request', 400)
			}

			// Update following for the user who sent the request
			await UserModel.findByIdAndUpdate(
				fromUser,
				{ $addToSet: { followings: toUser } },
				{ new: true },
			)

			// Update followers for the user who received the request
			await UserModel.findByIdAndUpdate(
				toUser,
				{ $addToSet: { followers: fromUser } },
				{ new: true },
			)

			res.status(201).json({ success: true, data: friendRequest })
		} catch (error) {
			next(error)
		}
	},
)

export const acceptFriendRequest = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { friendId } = req.body

			const existRequset = await FriendModel.findOne({
				fromUser: friendId,
				status: 'pending',
			})

			if (!existRequset) {
				throw new ErrorHandler('No request found', 400)
			}

			const friendRequest = await FriendModel.findByIdAndUpdate(
				existRequset._id,
				{ status: 'accepted' },
				{ new: true },
			)

			if (!friendRequest) {
				throw new ErrorHandler('Faild to accepted', 400)
			}
			// Get the user who is accepting
			const toUser = req.user.id

			// Get the sender of the friend
			const fromUser = friendRequest.fromUser

			// Update the 'friends' field
			await UserModel.findByIdAndUpdate(
				toUser,
				{ $addToSet: { friends: fromUser } },
				{ new: true },
			)

			// Update the 'friends' field
			await UserModel.findByIdAndUpdate(
				fromUser,
				{ $addToSet: { friends: toUser } },
				{ new: true },
			)

			res.status(200).json({ success: true, data: friendRequest })
		} catch (error) {
			next(error)
		}
	},
)

export const cancelFriendRequest = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user.id
		try {
			const { friendId } = req.body

			// Find friend requests where fromUser or toUser matches friendId
			const friendRequests = await FriendModel.find({
				$or: [{ fromUser: friendId }, { toUser: friendId }],
			})

			// Update the status of all found friend requests to 'rejected'
			const updatedFriendRequests = await Promise.all(
				friendRequests.map(async (friendRequest) => {
					friendRequest.status = 'rejected'
					return friendRequest.save()
				}),
			)

			// ==============Unfrirend===================
			// Update the 'user' field
			await UserModel.findByIdAndUpdate(
				userId,
				{ $pull: { friends: friendId } },
				{ new: true },
			)

			// Update the 'friends' field
			await UserModel.findByIdAndUpdate(
				friendId,
				{ $pull: { friends: userId } },
				{ new: true },
			)

			// ==============Unfollower & UnFollow===================
			// Update the 'followings' field
			await UserModel.findByIdAndUpdate(
				friendId,
				{ $pull: { followings: userId } },
				{ new: true },
			)
			await UserModel.findByIdAndUpdate(
				userId,
				{ $pull: { followings: friendId } },
				{ new: true },
			)

			// Update the 'followers' field
			await UserModel.findByIdAndUpdate(
				friendId,
				{ $pull: { followers: userId } },
				{ new: true },
			)
			await UserModel.findByIdAndUpdate(
				userId,
				{ $pull: { followers: friendId } },
				{ new: true },
			)

			res.status(200).json({ success: true, data: updatedFriendRequests })
		} catch (error) {
			next(error)
		}
	},
)

export const getPendingFriendRequests = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.id
			const pendingRequests = await FriendModel.find({
				toUser: userId,
				status: 'pending',
			}).populate('fromUser')

			res.status(200).json({ success: true, data: pendingRequests })
		} catch (error) {
			next(error)
		}
	},
)

export const getSendingFriendRequests = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.id
			const pendingRequests = await FriendModel.find({
				fromUser: userId,
				status: 'pending',
			}).populate('toUser')

			res.status(200).json({ success: true, data: pendingRequests })
		} catch (error) {
			next(error)
		}
	},
)

export const getMyFriendList = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.id
			// Find the user by ID and populate the 'friends' and 'contact' fields
			const user = await UserModel.findById(userId).exec()

			if (!user) {
				throw new Error('User not found')
			}

			if (!user.friends) {
				throw new Error('User has no friends')
			}

			// Populate each friend ID in the array
			const friendList = await Promise.all(
				user.friends.map(async (friendId) => {
					return await UserModel.findById(friendId).exec()
				}),
			)
			res.status(200).json({ success: true, data: friendList })
		} catch (error) {
			next(error)
		}
	},
)

export const getFriendListByID = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.params.id
			// Find the user by ID and populate the 'friends' and 'contact' fields
			const user = await UserModel.findById(userId).exec()

			if (!user) {
				throw new Error('User not found')
			}

			if (!user.friends) {
				throw new Error('User has no friends')
			}

			// Populate each friend ID in the array
			const friendList = await Promise.all(
				user.friends.map(async (friendId) => {
					return await UserModel.findById(friendId).exec()
				}),
			)
			res.status(200).json({ success: true, data: friendList })
		} catch (error) {
			next(error)
		}
	},
)

export const deleteAllRejectedRequest = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await FriendModel.deleteMany({ status: 'rejected' })

			res.status(200).json({ success: true, messeage: 'Deleted successfully' })
		} catch (error) {
			next(error)
		}
	},
)
