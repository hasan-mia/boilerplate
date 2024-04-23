import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import otpGenerator from 'otp-generator'
import catchAsyncError from '../middleware/catchAsyncError'
import OtpModel from '../models/otpModel'
import UserModel from '../models/userModel'
import { Otp } from '../types/otp'
import ErrorHandler from '../utils/errorhander'
import sendToken from '../utils/generateJwtToken'
import sendEmail from '../utils/sendEmail'

declare module 'express' {
	interface Request {
		user?: any
	}
}

// Register a User
export const registerUser = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { firstName, lastName, email, password, role } = req.body

			if (!firstName) {
				throw new ErrorHandler('Please provide a firstName', 400)
			}

			if (!lastName) {
				throw new ErrorHandler('Please provide a lastName', 400)
			}

			if (!password) {
				throw new ErrorHandler('Please provide a password', 400)
			}

			const existingUser = await UserModel.findOne({ email })

			if (existingUser) {
				throw new ErrorHandler(`${email} is already registered`, 401)
			}

			// Hash password
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)

			// Create new user
			const createdUser = await UserModel.create({
				firstName,
				lastName,
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

			const user = await UserModel.findOne({ email }).select('+password')

			if (!user) {
				throw new ErrorHandler('Invalid Email', 401)
			}

			if (!(await user.comparePassword(password))) {
				throw new ErrorHandler('Invalid Password', 401)
			}

			const responsePayload = {
				id: user._id,
				role: user.role,
			}

			sendToken(responsePayload, 200, res)
		} catch (error) {
			next(error)
		}
	},
)

// Forgot password
export const forgotPassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await UserModel.findOne({ email: req.body.email }).select(
			'firstName lastName email password',
		)
		if (!user) {
			return next(new ErrorHandler('User not found', 404))
		}

		// sent otp and save it to db
		const otp = otpGenerator.generate(4, {
			digits: true,
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		})

		const getOtp = otp
		try {
			await sendEmail({
				name: user.firstName + ' ' + user.lastName,
				email: req.body.email,
				otp: parseInt(getOtp),
				subject: 'Forgot Password OTP',
				message: `<p>You are receiving this email because you requested to reset your password.</p> 
                <p>Please use the following OTP:</p>`,
			})

			// Save OTP to database
			await OtpModel.deleteOne({ email: req.body.email })
			await OtpModel.create({
				user: user._id,
				email: req.body.email,
				otp,
				getOtp,
				otpVerified: false,
			})
			return res.json({
				success: true,
				message: 'OTP sent successfully',
			})
		} catch (error) {
			next(error)
		}
	},
)

// Reset password
export const resetPassword = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { otp, email, password } = req.body
			const user = await UserModel.findOne({ email }).select('+password')
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}

			const findOTP: Otp | null = await OtpModel.findOne({ email }).exec()

			if (!findOTP) {
				throw new ErrorHandler('OTP not found', 404)
			}

			if (!(await findOTP.compareOtp(otp))) {
				throw new ErrorHandler("OTP doesn't match", 401)
			}

			if (findOTP.otpVerified) {
				throw new ErrorHandler('OTP already used', 401)
			}
			// Verify OTP
			const newOtpVerified = {
				otpVerified: true,
			}
			await OtpModel.findByIdAndUpdate(findOTP._id, newOtpVerified, {
				new: true,
				runValidators: true,
				useFindAndModify: false,
			})

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

// Get My Info
export const myInfo = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await UserModel.findById(req.user.id)
				.populate('contact')
				.exec()
			if (!user) {
				throw new ErrorHandler('User not found', 404)
			}
			res.status(200).json({ success: true, data: user })
		} catch (error) {
			next(error)
		}
	},
)
