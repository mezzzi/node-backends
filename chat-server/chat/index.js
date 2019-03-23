// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');

// Routing for web users
app.use(express.static(path.join(__dirname, 'public')));

let ChatController = function() {

  // The signalling server
  const server = require('http').createServer(app);

  // The root io manager
  const io = require('socket.io')(server);

  // event types
  const events = {
    CONNECTION: 'connection',
    WELCOME: 'welcome',
    LOGIN_FEEDBACK: 'login feedback',
    DISCONNECTED: 'disconnected',
    ADD_USER: 'add user',
    USER_JOINED: 'user joined',
    USER_LEFT: 'user left',
    NEW_MESSAGE: 'new message',
    TYPING: 'typing',
    STOP_TYPING: 'stop typing'
  };

  // json Keys
  const Keys = {
    ONLINE_USERS: "onlineUsers",
    NUM_USERS: "numUsers",
    MESSAGE: "message",
    USER: "user",
    SUCCESS: "success"
  };

  // list of currently online users
  let onlineUsers = [];

  // all the sockets created so far
  let sockets = [];
  
  // number of currently online users
  let numUsers = 0;

  // a user broadcasts her intention to initiate
  // a private chat by starting the body of her 
  // message with the following sequence of characters
  const privateCode = "p:";

  // keep track of private rooms
  let roomCount = 0;

  // a utitlity function for dynamically
  // and flexibly building a json object
  let JsonBuilder = function(key, value) {

    let data = {};
    data[key] = value;

    return {

      add: function(k, v) {
        data[k] = v;
        return this;
      },

      build: function() {
        return data;
      }

    };

  };

  // The chat controller class serves as a ChatSocketManager
  let SocketManager = function(socket) {

    socket.proom = {};

    return {
            
      // the user with whom this socket is associated with
      user: null,

      // is user in the online_users list
      addedUser: false, 

      isUserUnique: function(name) {
        for(let i = 0; i < onlineUsers.length; i++) {
          if(onlineUsers[i].name === name) {
            return false;
          }
        }
        return true;
      },

      onAddUser: function (user) {
        
        // if already added, well, do not add again
        if (this.addedUser) return;

        // if user's name is not unique send her
        // a try again feedback message
        if(!this.isUserUnique(user.name)) {
          socket.emit(events.LOGIN_FEEDBACK,
            JsonBuilder(Keys.SUCCESS, false).build()
          );
          // terminate, unique name is a must
          return;          
        }
        // attach the unique name to the socket session
        socket.username = user.name;

        // add user to the onlineUsers list
        onlineUsers.push(user);

        // let the socket manager persist the user
        // as long as the connection is maintained
        this.user = user;

        // increment number of users
        ++numUsers;
        this.addedUser = true;

        // let the user know that her login attempt
        // has succeeded
        socket.emit(events.LOGIN_FEEDBACK, 
          JsonBuilder(Keys.SUCCESS, true)
          .add(Keys.NUM_USERS, numUsers).build()
        );

        // Echo globally (all clients) that a user has 
        // joined the chat-room
        socket.broadcast.emit(events.USER_JOINED, 
          JsonBuilder(Keys.USER, this.user)
          .add(Keys.NUM_USERS, numUsers)
          .build()
        );

      },  

      onNewMessage: function (message) {
        // broad cast the message to the joined room,
        // in case of private chat, broadcast is sent 
        // online to the partner on the other side.
        // differentiate between private and general chat
        console.log(JSON.stringify(message));
        if(message.body.startsWith(privateCode)) {

          // identify the destn name
          let strtIndex = message.body.indexOf(':');
          let endIndex = message.body.indexOf(':', strtIndex+1);
          let destnUser = message.body.substring(strtIndex+1, endIndex).trim();

          console.log("destn: "+destnUser);
          // if private room is null, then assume
          // this to be initiation
          if(socket.proom[destnUser] === undefined) {
            // find the destn socket first
            let destnSocket = null;
            for(let i = 0; i < sockets.length; i++) {
              if(sockets[i].username === destnUser) {
                destnSocket = sockets[i];
                break;
              }
            }

            // if destnSocket is null, return with ERROR
            if(destnSocket === null) {
              console.log('ERROR: socket with uname:'+destnUser+' not found');
            } else {
    
              // assign new rooms
              roomCount++;
              let privateRoom = 'private-'+roomCount;
              socket.proom[destnUser] = privateRoom;
              destnSocket.proom[socket.username] = privateRoom;
              console.log("rooms :"+socket.proom[destnUser]+": "+destnSocket.proom[socket.username]);
              // join them both
              socket.join(privateRoom);
              destnSocket.join(privateRoom);
            }          
            
          }
          
          // broadcast the private message only to the
          // designated priate room
          if(socket.proom !== undefined) {
            socket.broadcast.to(socket.proom[destnUser]).emit(events.NEW_MESSAGE, 
              JsonBuilder(Keys.USER, this.user)
              .add(Keys.MESSAGE, message).build()
            );     
          } else {
            console.log('ERROR: socket proom not defined');
          }

        } else {

          // message is broadcasted to the general chat room
          socket.broadcast.emit(events.NEW_MESSAGE, 
            JsonBuilder(Keys.USER, this.user)
            .add(Keys.MESSAGE, message).build()
          );
          
        }

      },

      onTyping: function () {

        // even here, got to distinguish between
        // private and general typing ...
        socket.broadcast.emit(events.TYPING, 
          JsonBuilder(Keys.USER, this.user).build());
          
      },

      onStopTyping: function () {
        socket.broadcast.emit(events.STOP_TYPING, 
          JsonBuilder(Keys.USER, this.user).build());
      },

      onDisconnect: function () {

        // if user is already added to the onlineUsers list,
        // do remove him
        if (this.addedUser) {
          onlineUsers.splice(onlineUsers.indexOf(this.user), 1);
          numUsers--;
          // echo globally that this user has left, event is not
          // sent to the user who just left, because he is gone
          socket.broadcast.emit(events.USER_LEFT, 
            JsonBuilder(Keys.USER, this.user)
            .add(Keys.NUM_USERS, numUsers).build()
          );
        }

      },    
      
      // send back a welcome greeting to the 
      // connecting user, send him the list of 
      // online users as a gift, so he can properly(uniquely)
      // join as a chat user
      emitWelcome: function() {
          socket.emit(events.WELCOME, 
          JsonBuilder(Keys.ONLINE_USERS, onlineUsers).build());
      },

      registerListeners: function () {
        // contrive a mechanism to preserve the
        // this context within the event handlers
        let self = this;
        let wrapper = function(method) {
            return function(data) {
              self[method](data);
            };
        };
        socket.on(events.NEW_MESSAGE, wrapper('onNewMessage'));
        socket.on(events.ADD_USER, wrapper('onAddUser'));
        socket.on(events.TYPING, wrapper('onTyping'));
        socket.on(events.STOP_TYPING, wrapper('onStopTyping'));
        socket.on(events.DISCONNECTED, wrapper('onDisconnect'));
        // send her the list of currently online users
        // right away, she needs it to check if her name
        // is unique or not
        this.emitWelcome();
        
      }

    };

  };

  let initConnectionListener = function() {

    // hook up the socket to its manager
    io.on(events.CONNECTION, function (socket) {
      // keep list of sockets
      sockets.push(socket);
      SocketManager(socket).registerListeners();
    });

  };

  let startSignalingServer = function() {
    const port = process.env.PORT || 3000;
    // start the server, in the mean while
    server.listen(port, function () {
      console.log('Server listening at port %d', port);
    });    
  };

  // start the signalling server, and 
  // hook up the connection listener
  startSignalingServer();
  initConnectionListener();

};

// bootstrap the controller
ChatController();
