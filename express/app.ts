import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import connectSocket from './config/socket'
import { API_PREFIX, SOCKET_PORT } from './constant'
import errorMiddleware from './middleware/error'

// import route
import auth from './routes/authRoutes'
import friend from './routes/friendRoutes'
import upload from './routes/uploadRoutes'
import user from './routes/userRoutes'

const app: Express = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

// Set up Socket.IO
const server = connectSocket(app)

server.listen(SOCKET_PORT, () => {
	console.log(`Socket is running on http://localhost:${SOCKET_PORT}`)
})

// Health checker
app.get('/', (_, res) => {
	res.send('OK : Server is running')
})

app.get(`${API_PREFIX}/api/v1/health`, (_, res) => {
	res.send('OK : Check CD')
})

// All Routes
app.use(`${API_PREFIX}/api/v1/auth`, auth)
app.use(`${API_PREFIX}/api/v1/user`, user)
app.use(`${API_PREFIX}/api/v1/upload`, upload)
app.use(`${API_PREFIX}/api/v1/friend`, friend)

// Error middleware
app.use(errorMiddleware)

export default app
