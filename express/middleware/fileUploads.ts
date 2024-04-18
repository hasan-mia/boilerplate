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

		const uploadedfiles: {
			filename: string
			type: string
			public_id: string
			url: string
		}[] = []
		for (const file of fileList) {
			if (file && file.name) {
				const tempFilePath = `temp_${Date.now()}_${file.name}`
				await file.mv(tempFilePath)

				const uploadOptions: cloudinary.UploadApiOptions = {
					folder: 'uploads',
					crop: 'scale',
				}

				const uploadedImage = await cloudinary.v2.uploader.upload(
					tempFilePath,
					uploadOptions,
				)

				uploadedfiles.push({
					filename: file.name,
					type: file.mimetype,
					public_id: uploadedImage.public_id,
					url: uploadedImage.secure_url,
				})

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
