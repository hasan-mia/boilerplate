import { NextFunction, Request, Response } from 'express'
import catchAsyncError from '../middleware/catchAsyncError'
import ContactModel from '../models/contactModel'
import UserModel from '../models/userModel'
import ErrorHandler from '../utils/errorhander'

declare module 'express' {
	interface Request {
		user?: any
	}
}

// Update password
export const updatePassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Retrieve the user by ID
			const user = await UserModel.findById(req.user.id).select('+password')

			// Check if user exists
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}

			// Compare old password
			const isPasswordMatched = await user.comparePassword(req.body.oldPass)

			if (!isPasswordMatched) {
				throw new ErrorHandler('Old Password is incorrect', 401)
			}

			if (req.body.newPass !== req.body.confirmPass) {
				throw new ErrorHandler("Password doesn't match", 401)
			}

			// Update password
			user.password = req.body.newPass
			await user.save()

			return res.json({
				success: true,
				message: 'Password updated successfully',
			})
		} catch (error) {
			next(error)
		}
	},
)

// Update User Profile
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.user.id
		const newUserData = req.body
		const { username } = req.body

		const existingUserData = await UserModel.findById(userId)

		if (!existingUserData) {
			throw new ErrorHandler('User not found', 404)
		}

		if (username) {
			const existingUserData = await UserModel.findOne({ username })
			if (existingUserData) {
				throw new ErrorHandler('username already used', 404)
			}
		}

		const updatedUserData = { ...existingUserData.toObject(), ...newUserData }

		await UserModel.findByIdAndUpdate(userId, updatedUserData)

		res.status(200).json({ success: true, data: updatedUserData })
	} catch (error) {
		next(error)
	}
}

// Delete User
export const deleteUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.params.id
			const user = await UserModel.findOneAndDelete({ _id: userId })

			if (!user) {
				throw new ErrorHandler(
					`User doesn't exist with Id: ${req.params.id}`,
					401,
				)
			}

			res.status(200).json({ success: true, message: 'Deleted successfully' })
		} catch (error) {
			next(error)
		}
	},
)

// Get User Info by ID
export const userInfoByID = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.params.id
		try {
			const user = await UserModel.findById(userId).populate('contact').exec()
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}
			res.status(200).json({ success: true, data: user })
		} catch (error) {
			next(error)
		}
	},
)

// Get All User
export const userAll = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await UserModel.find({}).populate('contact').exec()
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}
			res.status(200).json({ success: true, data: user })
		} catch (error) {
			next(error)
		}
	},
)

// Update User Contact Info
export const updateContactInfo = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.user.id
		const newContactData = req.body

		// Find the existing user
		const existingUser = await UserModel.findById(userId).exec()
		if (!existingUser) {
			throw new ErrorHandler('User not found', 404)
		}

		// Update the contact information
		const filter = { user: userId }
		const options = { upsert: true, new: true, setDefaultsOnInsert: true }
		const updatedContactData = await ContactModel.findOneAndUpdate(
			filter,
			newContactData,
			options,
		)

		if (!updatedContactData) {
			throw new ErrorHandler('Faild to update', 500)
		}

		// Update the user's contact reference
		existingUser.contact = updatedContactData._id
		await existingUser.save()

		// Send the response
		res.status(200).json({ success: true, data: updatedContactData })
	} catch (error) {
		next(error)
	}
}
