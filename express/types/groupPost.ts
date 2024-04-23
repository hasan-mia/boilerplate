import mongoose, { Document } from 'mongoose'

export enum PostType {
	IMAGE = 'image',
	VIDEO = 'video',
	LINK = 'link',
	PDF = 'pdf',
	TEXT = 'text',
}

export interface GroupPost extends Document {
	group: mongoose.Schema.Types.ObjectId
	user: mongoose.Schema.Types.ObjectId
	type: PostType
	mediaUrl?: string
	text?: string
	createdAt: Date
}
