const express = require('express');
const cookieparser = require('cookie-parser');
const app = express();
const postrouter = require('./routes/postroutes.js')
const userrouter = require('./routes/userRoutes.js')
const cors = require('cors')
const path = require('path')
const http = require('http')

const { Server } = require('socket.io');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: "Backend/Config/config.env" });
}

app.use(cors({
    origin: "http://localhost:3000",
}))


const server = http.createServer(app);
const io = new Server(server);


// const io = require('socket.io')(5051, {
//     cors: {
//         origin: 'http://localhost:3000'
//     }
// });


// message

const message = io.of('/message')
let Messageusers = [];
let OnlineUsers = [];

message.on('connection', (socket) => {

    socket.on(Actions.JOIN, (userId) => {
        const isUserExist = Messageusers.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id }
            Messageusers.push(user);
            message.emit(Actions.JOINED, { Messageusers })
        } else {
            for (let i = 0; i < Messageusers.length; i++) {
                if (Messageusers[i].userId == userId) {
                    Messageusers[i].socketId = socket.id;
                }
            }
        }
    })

    socket.on(Actions.SEND_MESSAGE, (data) => {
        const sender = Messageusers.find(user => user.userId === data.sender);
        const receiver = Messageusers.find(user => user.userId === data.receiver);
        const details = {
            sender: data.sender,
            conversationId: data.conversationId,
            message: data.message,
            receiver: data.receiver
        }
        if (receiver && sender) {
            message.to(receiver.socketId).emit(Actions.RECIVE_MESSAGE, details)
        }
    })


    socket.on(Actions.CALL_SEND, ({ offer, userId }) => {
        const isUserExist = Messageusers.find(user => user.userId === userId);
        if (isUserExist) {
            socket.to(isUserExist.socketId).emit(Actions.INCOMING_CALL, {
                socketId: socket.id,
                userId,
                offer
            })
        }
        else {
            message.to(socket.id).emit(Actions.CALL_REJECTED, {
                msg: 'user is offline'
            })
        }
    })

    socket.on(Actions.CALL_REJECTED, ({ socketId }) => {
        socket.to(socketId).emit(Actions.CALL_REJECTED, {
            msg: 'user busy...'
        })
    })
    socket.on(Actions.CALL_AECPTED, ({ userId, socketId, answer }) => {
        message.to(socketId).emit(Actions.CALL_AECPTED, {
            socketId: socket.id,
            answer,
            userId
        })
    })

    socket.on(Actions.PEER_NEGO_NEEDED, ({ socketId, offer }) => {
        socket.to(socketId).emit(Actions.PEER_NEGO_NEEDED, {
            socketId: socket.id,
            offer
        })
    })

    socket.on(Actions.PEER_NEGO_DONE, ({ socketId, answer }) => {
        socket.to(socketId).emit(Actions.PEER_NEGO_FINAL, {
            socketId: socket.id,
            answer
        })
    })


    socket.on('disconnect', () => {
        Messageusers = Messageusers.filter(user => user.socketId != socket.id);
        message.emit(Actions.JOINED, Messageusers);
    })

})


const notification = io.of('/notification')

notification.on('connection', (socket) => {
    socket.on(Actions.JOIN, ({ userId }) => {
        const user = { userId, socketId: socket.id }
        OnlineUsers.push(user)
    })

    socket.on(Actions.NOTIFICATION_GET, async ({ userName, who, type }) => {
        const isUser = await OnlineUsers.find(user => user.userId === who)
        if (isUser) {
            notification.to(isUser.socketId).emit(Actions.NOTIFICATION_GET, {
                userName, type
            })
        }
    })

    socket.on('disconnect', () => {
        OnlineUsers = OnlineUsers.filter(user => user.socketId != socket.id);
    })
})




// database connected
const { databaseconnect } = require('./Config/database.js');
const messageRouters = require('./routes/MessageRoutes.js');
const Actions = require('./Actions.js');
const NotificationRouter = require('./routes/Notification.js');
// const { disconnect } = require('mongoose');
databaseconnect;

// middle where use
app.use(cookieparser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }))

// routers use
app.use('/api/v1/post', postrouter);
app.use('/api/v1/user', userrouter);
app.use('/api/v1/message', messageRouters)
app.use('/api/v1/notification', NotificationRouter)

app.use(express.static(path.join(__dirname, "../Fronrend/app/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Fronrend/app/build/index.html"));
});

module.exports = server;


