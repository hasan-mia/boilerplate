import mongoose, { Document } from 'mongoose'

export enum PaymentMethod {
	BKASH = 'bkash',
	NAGAD = 'nagad',
	ROCKET = 'rocket',
	STRIPE = 'stripe',
}

export enum StatusType {
	PENDING = 'pending',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

export interface UserSubscription extends Document {
	user: mongoose.Schema.Types.ObjectId
	subscriptionPlan: mongoose.Schema.Types.ObjectId
	paymentMethod: PaymentMethod
	transactionID: string
	amount: number
	discount: number
	status: StatusType
	createdAt: Date
}
