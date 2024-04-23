import { NextFunction, Request, Response } from 'express'
import catchAsyncError from '../middleware/catchAsyncError'
import ErrorHandler from '../utils/errorhander'

// upoload single file
export const upLoadFile = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!res.locals.uploadedFileUrl) {
				throw new ErrorHandler('File not found', 400)
			}
			res.status(200).json({ success: true, data: res.locals.uploadedFileUrl })
		} catch (error) {
			next(error)
		}
	},
)

export const upLoadFiles = catchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!res.locals.uploadedfiles) {
				throw new ErrorHandler('File not found', 400)
			}
			res.status(200).json({ success: true, data: res.locals.uploadedfiles })
		} catch (error) {
			next(error)
		}
	},
)
