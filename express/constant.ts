export const API_PREFIX: string = process.env.API_PREFIX || '/express'
export const PORT: string | number = process.env.PORT || 5000
export const SOCKET_PORT: string | number = process.env.PORT || 6000
export const MONGO_URI: string =
	process.env.NODE_ENV === 'production'
		? process.env.MONGO_URI || ''
		: 'mongodb+srv://todo:prithila23@cluster0.xnn0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
export const JWT_SECRET: string =
	process.env.JWT_SECRET || 'fjhhIOHfjkflsjagju0fujljldfglse'
export const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '5d'
export const COOKIE_EXPIRE: string = process.env.COOKIE_EXPIRE || '2'
export const SMPT_SERVICE: string = process.env.SMPT_SERVICE || 'gmail'
export const SMPT_HOST: string = process.env.SMPT_HOST || 'smtp.gmail.com'
export const SMPT_PORT: string = process.env.SMPT_PORT || '465'
export const SMPT_MAIL: string = process.env.SMPT_MAIL || 'example@gmail.com'
export const SMPT_PASSWORD: string = process.env.SMPT_PASSWORD || 'password'
export const SMS_TOKEN: string = process.env.SMS_TOKEN || 'password'
export const APP_PASSWORD: string = process.env.APP_PASSWORD || 'password'
