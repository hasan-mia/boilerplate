import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRE, JWT_SECRET } from '../constant'

const sendToken = (user: any, statusCode: number, res: Response) => {
	const token = jwt.sign(user, JWT_SECRET, {
		expiresIn: JWT_EXPIRE,
	})

	res.status(statusCode).json({ success: true, user, token })
}

export default sendToken
