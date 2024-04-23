import bcrypt from 'bcryptjs'
import mongoose, { Model, Schema } from 'mongoose'
import { Otp } from '../types/otp'

const OtpSchema: Schema<Otp> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
		getOtp: {
			type: String,
			required: false,
		},
		otpVerified: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
)

OtpSchema.pre('save', async function (next) {
	if (!this.isModified('otp')) {
		next()
	}
	this.otp = await bcrypt.hash(this.otp, 10)
})

OtpSchema.methods.compareOtp = async function (
	this: Otp,
	enteredOtp: string,
): Promise<boolean> {
	return await bcrypt.compare(enteredOtp, this.otp)
}
const OtpModel: Model<Otp> = mongoose.model<Otp>('Otp', OtpSchema)

export default OtpModel
