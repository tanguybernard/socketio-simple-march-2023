import express from 'express';

import {Server, Socket} from "socket.io";


const app = express();
const PORT = 5000;

const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello guys',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const io = new Server(http, {
    cors: {
        origin: "http://localhost:8080"
    }
});

const activeUsers = new Map();

io.on("connection", function (socket: Socket) {
    console.log("Made socket connection");


    socket.on("new user", function (data) {
        activeUsers.set(socket.id,data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("disconnect", () => {
        const userName = activeUsers.get(socket.id);
        activeUsers.delete(socket.id);
        io.emit("user disconnected", userName);
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
});
