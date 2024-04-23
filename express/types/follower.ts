import mongoose, { Document } from 'mongoose'

export interface Follower extends Document {
	user: mongoose.Types.ObjectId
	follower: mongoose.Types.ObjectId
}
