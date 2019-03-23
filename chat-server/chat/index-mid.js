// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing for web users
app.use(express.static(path.join(__dirname, 'public')));

// list of currently online users
let onlineUsers = [];

// number of currently online users
let numUsers = 0;

// event types
let events = {
  CONNECTION: 'connection',
  WELCOME: 'welcome',
  LOGIN_SUCCESS: 'login success',
  DISCONNECTED: 'disconnected',
  USER_ADDED: 'user added',
  USER_JOINED: 'user joined',
  USER_LEFT: 'user left',
  NEW_MESSAGE: 'new message',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing'
}

// The chat controller class serves as a ChatSocketManager
let ChatController = function () {

  return {
    // the user with whom this socket is associated with
    user: null,

    // is user in the online_users list
    addedUser: false,

    // the socket that is given to the user
    socket: "huluagerie",

    // the room which this socket has currently joined
    room: null,

    onDisconnect: function () {
      // if user is already added to the onlineUsers list,
      // do remove him
      if (this.addedUser) {
        onlineUsers.splice(onlineUsers.indexOf(this.user), 1);
        numUsers--;
        // echo globally that this user has left, event is not
        // sent to the user who just left, because he is gone
        this.socket.broadcast.emit(events.USER_LEFT, {
          user: this.user,
          numUsers: numUsers
        });

      }
    },

    onAddUser: function (user) {
      console.log('this.socket: '+this.socket);
      // if already added, well, do not add again
      if (this.addedUser) return;

      // increment number of users
      ++numUsers;
      this.addedUser = true;

      // since this routine is a response to a login attempt,
      // fire a login event indicating that the attempt has
      // succeeded. This is sent back to the socket owner.
      this.socket.emit(events.LOGIN_SUCCESS, {
        numUsers: numUsers
      });

      // echo globally (all clients) that a person has connected
      this.socket.broadcast.emit(events.USER_JOINED, {
        user: this.user,
        numUsers: numUsers
      });

    },

    onNewMessage: function (id, message) {

      // broad cast the message to the joined room,
      // in case of private chat, broadcast is sent 
      // online to the partner on the other side.
      this.room = this.room || id;
      this.socket.broadcast.to(this.room).emit(events.NEW_MESSAGE, {
        user: this.user,
        message: message
      });
    },

    onTyping: function () {
      this.socket.broadcast.to(this.room).emit(events.TYPING, {
        user: this.user
      });
    },

    onStopTyping: function () {
      this.socket.broadcast.to(this.room).emit(events.STOP_TYPING, {
        user: this.user
      });
    },

    registerListeners: function (socket) {
      console.log("this socket: "+this.socket);
      this.socket = socket;
      this.socket.on(events.NEW_MESSAGE, this.onNewMessage);
      this.socket.on(events.USER_ADDED, this.onAddUser);
      this.socket.on(events.TYPING, this.onTyping);
      this.socket.on(events.STOP_TYPING, this.onStopTyping);
      this.socket.on(events.DISCONNECTED, this.onDisconnect);
      // send her the list of currently online users
      // right away, she needs it to check if her nickname
      // is unique or not
      this.socket.to(this.room).emit(events.WELCOME, {
        onlineUsers: onlineUsers
      });
    }

  };

};

var controllers = [];

// hook up the ChatController
io.on(events.CONNECTION, function (socket) {
  let controller = ChatController();
  controller.registerListeners(socket);
  controllers.push(controller);
});