import mongoose, { Document } from 'mongoose'

export interface Otp extends Document {
	compareOtp: any
	user: mongoose.Types.ObjectId
	email: string
	otp: string
	getOtp?: string
	otpVerified?: boolean
	createdAt: Date
}
