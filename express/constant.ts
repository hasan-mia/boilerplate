export const API_PREFIX: any = process.env.API_PREFIX || '/express-ts'
export const PORT: any | number = process.env.PORT || 5000
export const SOCKET_PORT: any | number = process.env.PORT || 6000
export const MONGO_URI: any =
	process.env.NODE_ENV === 'production'
		? process.env.MONGO_URI || ''
		: 'mongodb+srv://todo:prithila23@cluster0.xnn0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
export const JWT_SECRET: any =
	process.env.JWT_SECRET || 'fjhhIOHfsd56jkflsjagrylois44f0oju0fujljldfglse'
export const JWT_EXPIRE: any = process.env.JWT_EXPIRE || '5d'
export const COOKIE_EXPIRE: any = process.env.COOKIE_EXPIRE || '2'
export const SMPT_SERVICE: string = process.env.SMPT_SERVICE || 'gmail'
export const SMPT_HOST: any = process.env.SMPT_HOST || 'domain.com'
export const SMPT_PORT: any = process.env.SMPT_PORT || '465'
export const SMPT_MAIL: any = process.env.SMPT_MAIL || 'admin@domain.com'
export const SMPT_PASSWORD: any = process.env.SMPT_PASSWORD || 'password'
export const SMS_TOKEN: any = process.env.SMS_TOKEN || 'password'
export const APP_PASSWORD: any = process.env.APP_PASSWORD || 'password'
