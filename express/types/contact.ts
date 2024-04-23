import mongoose, { Document } from 'mongoose'

export interface Contact extends Document {
	user: mongoose.Types.ObjectId
	email?: string
	phone?: string
	address_one?: string
	address_two?: string
	city?: string
	post_code?: string
	state?: string
	country?: string
	createdAt: Date
}
