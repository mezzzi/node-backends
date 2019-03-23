const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const config = require('./config/database');
const multer = require('multer');

const authMiddleware = require('./middlewares/auth');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, config.options)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log("NOT CONNECTED TO MONGO"));;

// instantiate the app
const app = express();

const user = require(`${ __dirname }/routes/user`);
const chat_user = require(`${ __dirname }/routes/chat_user`);
const message = require(`${ __dirname }/routes/message`);
const profile = require(`${ __dirname }/routes/profile`);

// ALLOW CORS
app.use(function (req, resp, next) {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    resp.header("Access-Control-Allow-Headers", "*");
    next();
})

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// register the middleware for serving static pages
app.use(express.static(`${ __dirname }/public`));

app.use(passport.initialize());

// use the routers
app.use('/user', user.router);
app.use('/chat_user', chat_user.router);
app.use('/msg', message.router);

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${ __dirname}/uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, `${ req.params['username'] }.${file.originalname.split('.')[1]}`)
    }
});

app.use(function (req, res, next) {
    // it was done to allow cross origin request from angular server
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/api/:username', function (req, res, next) {
    console.log('username: ' + req.params['username']);
    console.log('file uploaded');
    next();
}, multer({
    storage: storage
}).any());

// tell express to listen to the specified port
app.listen(8000);