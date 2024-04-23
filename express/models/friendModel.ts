import mongoose, { Model, Schema } from 'mongoose'
import { Friend } from '../types/firend'

const FriendSchema: Schema<Friend> = new Schema(
	{
		fromUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		toUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'rejected'],
			default: 'pending',
		},
	},
	{ timestamps: true },
)

const FriendModel: Model<Friend> = mongoose.model<Friend>(
	'Friend',
	FriendSchema,
)

export default FriendModel
