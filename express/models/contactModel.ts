import { isEmail, isPhoneNumber } from 'class-validator'
import mongoose, { Model, Schema } from 'mongoose'
import { Contact } from '../types/contact'

const ContactSchema: Schema<Contact> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		email: {
			type: String,
			required: false,
			unique: true,
			validate: {
				validator: (value: string) => isEmail(value),
				message: 'Please enter a valid email',
			},
		},
		phone: {
			type: String,
			required: false,
			unique: true,
			validate: {
				validator: (value: string) => isPhoneNumber(value),
				message: 'Invalid phone number format',
			},
		},
		address_one: String,
		address_two: String,
		city: String,
		post_code: String,
		state: String,
		country: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
)

const ContactModel: Model<Contact> = mongoose.model<Contact>(
	'Contact',
	ContactSchema,
)

export default ContactModel
