const express = require("express");

const server = require('http').createServer(express);
const io = require('socket.io')(server);

const online_users = [];
const user_ids = {};

var namespace = io.of('/pulse-name-space');

namespace.on('connection',function (socket) {
   console.log("someone connected");
});

io.on('connect', (client) => {

    console.log('client connected');

    client.on('join', function (username) {

        if(username == null) {
            return;
        }

        console.log(`${username} joined`);
        client.username = username;

        if(online_users.indexOf(username) === -1) {
            online_users.push(username)
        }
        user_ids[username] = client.id;

        // broadcast the updated list of online users.
        io.sockets.emit('online_users', online_users);

    });    

    // when a message comes, forward it to the destination client
    client.on('message', (msg) => {
        console.log('[server](message): %s', JSON.stringify(msg));
        let destn_id = user_ids[msg.to];
        io.to(destn_id).emit('message', msg);
    });

    // upon disconnect event, update online users list
    client.on('disconnect', () => {

        console.log(client.username + ' left the chat.');

        // remove the disconnecting user from online online users list
        for (let i = 0; i < online_users.length; i++) {
            if (online_users[i] == client.username) {
                online_users.splice(i, 1);
                break;
            }
        }

        // broadcast the updated list of online users.
        io.sockets.emit('online_users', online_users);

    });

});

// tell express to listen to the specified port
server.listen(8001);
