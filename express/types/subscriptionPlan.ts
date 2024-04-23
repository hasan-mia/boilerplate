import { Document } from 'mongoose'

export enum TierType {
	BRONZE = 'bronze',
	SILVER = 'silver',
	GOLD = 'gold',
	DIAMOND = 'diamond',
}

export enum DurationType {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	YEARLY = 'yearly',
}

export interface SubscriptionPlan extends Document {
	name: string
	description: string
	tier: TierType
	price: number
	duration: DurationType
	createdAt: Date
}
