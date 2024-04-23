import { Document } from 'mongoose'

export interface Category extends Document {
	name: string
	avatar: string
	createdAt: Date
}
