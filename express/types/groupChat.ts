import mongoose, { Document } from 'mongoose'

export enum ChatType {
	IMAGE = 'image',
	VIDEO = 'video',
	LINK = 'link',
	PDF = 'pdf',
	TEXT = 'text',
}

export interface GroupChat extends Document {
	group: mongoose.Schema.Types.ObjectId
	user: mongoose.Schema.Types.ObjectId
	type: ChatType
	mediaUrl?: string
	text?: string
	createdAt: Date
}
