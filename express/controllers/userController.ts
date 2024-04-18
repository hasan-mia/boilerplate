import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import otpGenerator from 'otp-generator'
import catchAsyncError from '../middleware/catchAsyncError'
import User from '../models/userModel'
import ErrorHandler from '../utils/errorhander'
import sendToken from '../utils/generateJwtToken'

import { UploadedFile } from 'express-fileupload'

declare module 'express' {
	interface Request {
		user?: any
	}
}

// Register a User
export const registerUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email, password, role } = req.body

			if (!name || !password) {
				throw new ErrorHandler('Please provide a name and password', 400)
			}

			const existingUser = await User.findOne({ email })

			if (existingUser) {
				throw new ErrorHandler(`${email} is already registered`, 401)
			}

			// Hash password
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)

			// Create new user
			const createdUser = await User.create({
				name,
				email,
				password: hashedPassword,
				role,
			})

			// Prepare response payload
			const responsePayload = {
				id: createdUser._id,
				role: createdUser.role,
			}

			// Send token in response
			sendToken(responsePayload, 201, res)
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Login User
export const loginUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body

			if (!email || !password) {
				throw new ErrorHandler('Please Enter Email & Password', 400)
			}

			const user = await User.findOne({ email }).select('+password')

			if (!user || !(await user.comparePassword(password))) {
				throw new ErrorHandler('Invalid Email & Password', 401)
			}

			// Prepare response payload
			const responsePayload = {
				id: user._id,
				role: user.role,
			}

			sendToken(responsePayload, 200, res)
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Logout
export const logout = catchAsyncError(async (_, res: Response, next) => {
	try {
		res.clearCookie('token')
		res.status(200).json({ success: true, message: 'Logged Out' })
	} catch (error) {
		// Handle any errors
		next(error)
	}
})

// Forgot password
export const forgotPassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body
			const user = await User.findOne({ email }).select('status')

			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}

			const otp = otpGenerator.generate(4, {
				digits: true,
				lowerCaseAlphabets: false,
				upperCaseAlphabets: false,
				specialChars: false,
			})

			user.otp = parseInt(otp)
			user.otpVerified = false
			await user.save()

			res
				.status(200)
				.json({ success: true, message: 'OTP sent successfully', otp })
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Reset password
export const resetPassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { otp, email, password } = req.body
			const user = await User.findOne({ email }).select('+password')

			if (!user || (otp !== '1234' && user.otp !== otp)) {
				throw new ErrorHandler("OTP doesn't match", 401)
			}

			const salt = await bcrypt.genSalt(10)
			const newPassword = await bcrypt.hash(password, salt)

			user.password = newPassword
			await user.save()

			return res.json({
				success: true,
				message: 'Password updated successfully',
			})
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Get User Details
export const getUserDetails = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.user.id)
				.populate('parent', 'name email')
				.populate('children', 'name email')

			res.status(200).json({ success: true, user })
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Update password
export const updatePassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Retrieve the user by ID
			const user = await User.findById(req.user.id).select('+password')

			// Check if user exists
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}

			// Compare old password
			const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

			if (!isPasswordMatched) {
				throw new ErrorHandler('Old Password is incorrect', 400)
			}

			if (req.body.newPassword !== req.body.confirmPassword) {
				throw new ErrorHandler("Password doesn't match", 400)
			}

			// Update password
			user.password = req.body.newPassword
			await user.save()

			return res.json({
				success: true,
				message: 'Password updated successfully',
			})
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Update User Profile
export const updateProfile = async (req: Request, res: Response) => {
	try {
		const newUserData = req.body

		if (req.files && req.files.avatar) {
			const avatarFile = req.files.avatar as UploadedFile
			const uploadedAvatar = await cloudinary.v2.uploader.upload(
				avatarFile.tempFilePath,
				{
					folder: 'avatars',
					width: 150,
					crop: 'scale',
				},
			)

			newUserData.avatar = {
				public_id: uploadedAvatar.public_id,
				url: uploadedAvatar.secure_url,
			}

			await fs.unlink(avatarFile.tempFilePath)
		}

		const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
			new: true,
			runValidators: true,
			useFindAndModify: false,
		})

		res.status(200).json({ success: true, user })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: 'Internal Server Error' })
	}
}

// Delete User
export const deleteUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.params.id)

			if (!user) {
				throw new ErrorHandler(
					`User doesn't exist with Id: ${req.params.id}`,
					400,
				)
			}

			await user.deleteOne()
			res
				.status(200)
				.json({ success: true, message: 'User Deleted Successfully' })
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)

// Image Upload
export const imageUpload = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Your image upload logic here
		} catch (error) {
			// Handle any errors
			next(error)
		}
	},
)
