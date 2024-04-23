import mongoose, { Model, Schema } from 'mongoose'
import { Following } from '../types/following'

const FollowingSchema: Schema<Following> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		following: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
)

const FollowingModel: Model<Following> = mongoose.model<Following>(
	'Following',
	FollowingSchema,
)

export default FollowingModel
