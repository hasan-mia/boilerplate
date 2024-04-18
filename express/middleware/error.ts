/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/errorhander'

const errorHandlerMiddleware = (
	err: any,
	_: Request,
	res: Response,
	__: NextFunction,
) => {
	err.statusCode = err.statusCode || 500
	err.message = err.message || 'Internal Server Error'

	// Wrong MongoDB error
	if (err.name === 'CastError') {
		const message = `Resource not found. Invalid : ${err.path}`
		err = new ErrorHandler(message, 400)
	}

	// Mongoose duplicate key error
	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
		err = new ErrorHandler(message, 400)
	}

	// Wrong JWT error
	if (err.name === 'JsonWebTokenError') {
		const message = `JSON Web Token is invalid. Try again`
		err = new ErrorHandler(message, 400)
	}

	// JWT Expire error
	if (err.name === 'TokenExpiredError') {
		const message = `JSON Web Token is expired. Try again`
		err = new ErrorHandler(message, 400)
	}

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
		stack: err.stack,
	})
}

export default errorHandlerMiddleware
