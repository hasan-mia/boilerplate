import mongoose, { Model, Schema } from 'mongoose'
import { Follower } from '../types/follower'

const FollowerSchema: Schema<Follower> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		follower: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
)

const FollowerModel: Model<Follower> = mongoose.model<Follower>(
	'Follower',
	FollowerSchema,
)

export default FollowerModel
