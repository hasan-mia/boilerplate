import bcrypt from 'bcryptjs'
import { isEmail } from 'class-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose, { Document, Model, Schema } from 'mongoose'
import { JWT_SECRET } from '../constant'

enum Role {
	SUPER_ADMIN = 'super_admin',
	ADMIN = 'admin',
	USER = 'user',
}
enum Gender {
	Male = 'male',
	Female = 'female',
	NotSay = 'not_say',
}

enum IdCardVerificationStatus {
	Pending = 'pending',
	Approved = 'approved',
	Rejected = 'rejected',
}

interface User extends Document {
	first_name: string
	last_name: string
	email: string
	username?: Date
	mobile?: string | null
	password: string
	avatar?: string
	birth_date?: string
	role: Role
	id_card_verification_status: IdCardVerificationStatus
	parent?: mongoose.Schema.Types.ObjectId
	children?: mongoose.Schema.Types.ObjectId[]
	status: string
	gender: Gender
	isVerified: boolean
	otp?: number
	fcmtoken?: string
	createdAt: Date
	resetPasswordToken?: string
	resetPasswordExpire?: Date
	otpVerified?: boolean

	getJWTToken(): string
	comparePassword(enteredPassword: string): Promise<boolean>
	getResetPasswordToken(): string
}

const UserSchema: Schema<User> = new Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
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
		required: true,
		unique: true,
	},
	mobile: {
		type: String,
		default: null,
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
	birth_date: {
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
	id_card_verification_status: {
		type: String,
		default: IdCardVerificationStatus.Pending,
		enum: Object.values(IdCardVerificationStatus),
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	children: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	fcmtoken: {
		type: String,
		default: '',
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	otp: {
		type: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
})

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
		expiresIn: process.env.JWT_EXPIRE || '5d',
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
