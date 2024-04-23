import mongoose, { Document } from 'mongoose'
import { Friend } from './firend'
import { Follower } from './follower'
import { Following } from './following'

export enum Role {
	SUPER_ADMIN = 'super_admin',
	ADMIN = 'admin',
	USER = 'user',
}

export enum Gender {
	Male = 'male',
	Female = 'female',
	NotSay = 'not_say',
}

export enum IdCardVerificationStatus {
	Pending = 'pending',
	Approved = 'approved',
	Rejected = 'rejected',
}

export interface User extends Document {
	firstName: string
	lastName: string
	email: string
	username?: string
	mobile?: string
	password: string
	avatar?: string
	birthDate?: string
	role: Role
	idCardFront?: string
	idCardBack?: string
	idCardVerificationStatus: IdCardVerificationStatus
	parent?: mongoose.Schema.Types.ObjectId
	children?: mongoose.Schema.Types.ObjectId[]
	contact: mongoose.Schema.Types.ObjectId
	gender: Gender
	language?: string
	isVerified: boolean
	fcmtoken?: string
	resetPasswordToken?: string
	resetPasswordExpire?: Date
	otpVerified?: boolean
	friends?: Friend[]
	followers?: Follower[]
	followings?: Following[]
	createdAt: Date

	getJWTToken(): string
	comparePassword(enteredPassword: string): Promise<boolean>
	getResetPasswordToken(): string
}
