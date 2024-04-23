import mongoose, { Document } from 'mongoose'
import { PaymentMethod, StatusType } from './userSubscription'

export interface TransactionHistory extends Document {
	user: mongoose.Schema.Types.ObjectId
	paymentMethod: PaymentMethod
	transactionID: string
	amount: number
	status: StatusType
	createdAt: Date
}
