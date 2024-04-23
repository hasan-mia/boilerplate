import bcrypt from 'bcryptjs'
import { isEmail, isMobilePhone } from 'class-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose, { Model, Schema } from 'mongoose'
import { JWT_SECRET } from '../constant'
import { Gender, IdCardVerificationStatus, Role, User } from '../types/user'

const UserSchema: Schema<User> = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (value: string) => isEmail(value),
				message: 'Please enter a valid email',
			},
		},
		username: {
			type: String,
			required: false,
			unique: true,
		},
		mobile: {
			type: String,
			required: false,
			unique: true,
			validate: {
				validator: (value: string) => isMobilePhone(value),
				message: 'Please enter a valid email',
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
			select: false,
		},
		avatar: {
			type: String,
			default: '',
		},
		birthDate: {
			type: Date,
			default: '',
		},
		role: {
			type: String,
			default: Role.USER,
			enum: Object.values(Role),
		},
		gender: {
			type: String,
			default: Gender.NotSay,
			enum: Object.values(Gender),
		},
		language: {
			type: String,
			default: '',
		},
		idCardFront: {
			type: String,
			default: '',
		},
		idCardBack: {
			type: String,
			default: '',
		},
		idCardVerificationStatus: {
			type: String,
			default: IdCardVerificationStatus.Pending,
			enum: Object.values(IdCardVerificationStatus),
		},
		fcmtoken: {
			type: String,
			default: '',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Friend',
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Follower',
			},
		],
		followings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Following',
			},
		],
		contact: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Contact',
			default: null,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true },
)

UserSchema.pre<User>('save', async function (next) {
	try {
		if (!this.isModified('password') || this.password.startsWith('$2a$')) {
			return next()
		}
		this.password = await bcrypt.hash(this.password, 10)
		return next()
	} catch (error: any) {
		return next(error)
	}
})

UserSchema.methods.getJWTToken = function (this: User) {
	return jwt.sign({ id: this._id }, JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || '365d',
	})
}

UserSchema.methods.comparePassword = async function (
	this: User,
	enteredPassword: string,
) {
	return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function (this: User) {
	const resetToken = crypto.randomBytes(20).toString('hex')
	const hashedResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')
	this.resetPasswordToken = hashedResetToken
	this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000)
	return resetToken
}

const UserModel: Model<User> = mongoose.model<User>('User', UserSchema)

export default UserModel
