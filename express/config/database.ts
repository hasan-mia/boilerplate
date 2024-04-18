import mongoose from 'mongoose'
import { MONGO_URI } from '../constant'

const connectDatabase = () => {
	mongoose
		.connect(MONGO_URI as string)
		.then((data) => {
			console.log(`MongoDB connected with server: ${data.connection.host}`)
		})
		.catch((error) => {
			console.error('Error connecting to MongoDB:', error)
		})
}

export default connectDatabase
