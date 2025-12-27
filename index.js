const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors')
const http = require('http')
const { connectDb } = require('./config/db');
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth.routes');
const { videoRouter } = require('./routes/video.routes');
const { Server } = require('socket.io');


// responsible for export data from .env file.
dotenv.config();

// port
const port = process.env.port || 5000


const app = express();
// create server 
const server = http.createServer(app)

// socket io setup
const io = new Server(server,{
    cors:{
        origin:'*'
    }
})

app.use(express.json())
app.use(cors({origin: 'http://localhost:5173',credentials:true}))
app.use(cookieParser())

app.use((req, res, next) => {
  req.io = io;
  next();
});

// socket io connection.
io.on("connect", (socket)=>{
    console.log('client connected', socket.id);

    socket.on('disconnect', ()=>{
        console.log('client disconnected',socket.id)
    })
})


// routes for register and login
app.use('/api/auth',authRouter)

// routes for video upload
app.use('/api/videos',videoRouter)


// starts the server and makes your backend listen 
server.listen(port, async ()=>{
    await connectDb()
    console.log('server running...')
})

module.exports = {io}