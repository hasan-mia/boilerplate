import mongoose, { Document } from 'mongoose'

export interface Friend extends Document {
	fromUser: mongoose.Types.ObjectId
	toUser: mongoose.Types.ObjectId
	status: 'pending' | 'accepted' | 'rejected'
}
