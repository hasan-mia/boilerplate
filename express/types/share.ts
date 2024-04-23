import mongoose, { Document } from 'mongoose'

export enum ShareType {
	GROUP = 'group',
	SUBSCRIPTION = 'subscription',
}

export interface Share extends Document {
	sharer: mongoose.Schema.Types.ObjectId
	recipient: mongoose.Schema.Types.ObjectId
	shareType: ShareType
	shareId: mongoose.Schema.Types.ObjectId
	createdAt: Date
}
