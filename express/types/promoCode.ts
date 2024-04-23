import { Document } from 'mongoose'

export interface PromoCode extends Document {
	code: string
	discount: number
	maxUses: number
	currentUses: number
	expiryDate: Date
	createdAt: Date
}
