import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import app from './app'
import connectDatabase from './config/database'
import { PORT } from './constant'
const cloudinaryV2 = cloudinary.v2

dotenv.config({ path: './.env' })

//Handling Uncaught Exception
process.on('uncaughtException', (err: any) => {
	console.log(`Error: ${err.message}`)
	console.log(`Shutting down the server due to Uncaught Exception`)

	throw Error('Server Not Running...')
})

connectDatabase()

// cloudinary
cloudinaryV2.config({
	cloud_name: 'dxbdrkvwr',
	api_key: '117564167476672',
	api_secret: 'QYLYPnGFlsuDBSNBk3n7TbXjRKw',
})

const server = app.listen(PORT, () => {
	console.log(`Server is working on http://localhost:${PORT}`)
})

// Unhandled Promise Rejection
process.on('unhandledRejection', (err: Error) => {
	console.log(`Error: ${err.message}`)
	console.log(`Shutting down the server due to Unhandled Promis Rejection`)

	server.close(() => {
		throw Error('Server Not Running...')
	})
})

// export app
module.exports = app
