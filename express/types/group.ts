import mongoose, { Document } from 'mongoose'
import { GroupMember } from './groupMember'

export enum GroupType {
	PUBLIC = 'public',
	PRIVATE = 'private',
}

export interface Group extends Document {
	name: string
	description: string
	avatar: string
	banner: string
	type: GroupType
	creator: mongoose.Schema.Types.ObjectId
	category: mongoose.Schema.Types.ObjectId
	limit: number
	members?: GroupMember[]
	expiredAt: Date
	createdAt: Date
}
