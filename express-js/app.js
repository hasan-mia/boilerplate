const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const user = require('./routes/userRoutes')

const errorMiddleware = require('./middleware/error')
const { API_PREFIX } = require('./constant.js')
const connectSocket = require('./config/socket.js')

app.use(cors());
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

// Set up Socket.IO
const server = connectSocket(app);
app.set('io', require('socket.io')(server));

// health checker
app.get(`${API_PREFIX}/api/v1/health`, (_, res) => {
  res.send('OK : Check CD')
})

// All Route
app.use(`${API_PREFIX}/api/v1`, user)


// error middleware
app.use(errorMiddleware)

module.exports = app
