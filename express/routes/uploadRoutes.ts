import express from 'express'
import { upLoadFile, upLoadFiles } from '../controllers/uploadController'
import fileUpload from '../middleware/fileUpload'
import fileUploads from '../middleware/fileUploads'

const router = express.Router()

router.route('/file').post(fileUpload, upLoadFile)
router.route('/files').post(fileUploads, upLoadFiles)

export default router
