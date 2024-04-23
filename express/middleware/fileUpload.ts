import cloudinary from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.files || !('file' in req.files)) {
			return res
				.status(400)
				.json({ success: false, message: 'No file uploaded' })
		}

		const file = req.files.file as any

		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: 'No file uploaded' })
		}

		if (!file.name) {
			return res.status(400).json({ success: false, message: 'Invalid file' })
		}

		const tempFilePath = `temp_${Date.now()}_${file.name}`
		await file.mv(tempFilePath)

		const uploadedFile = await cloudinary.v2.uploader.upload(tempFilePath, {
			folder: 'sharekorbo',
			crop: 'scale',
		})
		const uploadedFileUrl = uploadedFile.secure_url

		await fs.unlink(tempFilePath)

		res.locals.uploadedFileUrl = uploadedFileUrl
		next()
	} catch (error) {
		next(error)
	}
}

export default fileUpload
