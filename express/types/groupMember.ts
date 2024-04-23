import mongoose, { Document } from 'mongoose'

export interface GroupMember extends Document {
	user: mongoose.Schema.Types.ObjectId
	group: mongoose.Schema.Types.ObjectId
	isPaid: boolean
	joinedAt: Date
	createdAt: Date
}
