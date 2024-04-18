import { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'

const connectSocket = (app: Express) => {
	const server = http.createServer(app)
	const io = new Server(server)

	io.on('connection', (socket) => {
		console.log('A user connected', socket.id)

		socket.on('disconnect', () => {
			console.log('User disconnected')
		})
	})

	return server
}

export default connectSocket
