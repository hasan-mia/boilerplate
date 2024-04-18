import nodemailer, { Transporter } from 'nodemailer'
import {
	SMPT_HOST,
	SMPT_MAIL,
	SMPT_PASSWORD,
	SMPT_PORT,
	SMPT_SERVICE,
} from '../constant'

interface EmailOptions {
	email: string
	subject: string
	message: string
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
	const transporter: Transporter = nodemailer.createTransport({
		service: process.env.SMPT_SERVICE || SMPT_SERVICE,
		host: process.env.SMPT_HOST || SMPT_HOST,
		port: Number(process.env.SMPT_PORT) || SMPT_PORT,
		secure: true,
		auth: {
			user: process.env.SMPT_MAIL || SMPT_MAIL,
			pass: process.env.SMPT_PASSWORD || SMPT_PASSWORD,
		},
	})

	const mailOptions = {
		from: process.env.SMPT_MAIL || SMPT_MAIL,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}

	await transporter.sendMail(mailOptions)
}

export default sendEmail
