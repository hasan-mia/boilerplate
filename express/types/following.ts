import mongoose, { Document } from 'mongoose'

export interface Following extends Document {
	user: mongoose.Types.ObjectId
	following: mongoose.Types.ObjectId
}
