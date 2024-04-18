import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constant'
import ErrorHandler from '../utils/errorhander'
import catchAsyncError from './catchAsyncError'

declare module 'express' {
	interface Request {
		user?: any
	}
}

export const isAuthenticated = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		const authHeader = req.headers['authorization']

		if (typeof authHeader === 'undefined') {
			return next(new ErrorHandler('un-authorized', 401))
		}

		const token = authHeader.split(' ')[1]
		if (!token) {
			return next(new ErrorHandler('Please Login to access this resource', 401))
		}
		const secret = JWT_SECRET
		const decodedData = jwt.verify(token, secret) as any
		req.user = decodedData
		next()
	},
)

export const isAuthorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRole = req.user?.role

		const isAuthorized = roles.some((role) => userRole === role)

		if (!isAuthorized) {
			return next(
				new ErrorHandler(
					`Role: ${userRole} is not allowed to access this resource`,
					403,
				),
			)
		}

		next()
	}
}
