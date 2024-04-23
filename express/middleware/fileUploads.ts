import cloudinary from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'

const fileUploads = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.files || !req.files.files) {
			return res
				.status(400)
				.json({ success: false, message: 'No files uploaded' })
		}

		const fileList = Array.isArray(req.files.files)
			? req.files.files
			: [req.files.files]

		if (!fileList || fileList.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: 'No files uploaded' })
		}

		const uploadedfiles: string[] = []
		for (const file of fileList) {
			if (file && file.name) {
				const tempFilePath = `temp_${Date.now()}_${file.name}`
				await file.mv(tempFilePath)

				const uploadedFile = await cloudinary.v2.uploader.upload(tempFilePath, {
					folder: 'sharekorbo',
					crop: 'scale',
				})
				uploadedfiles.push(uploadedFile.secure_url)

				await fs.unlink(tempFilePath)
			} else {
				console.error('File or file name is undefined:', file)
			}
		}

		res.locals.uploadedfiles = uploadedfiles
		next()
	} catch (error) {
		next(error)
	}
}

export default fileUploads
