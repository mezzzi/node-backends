const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
// const passport = require('passport');
const multer = require('multer');
const config = require('./config/database');

// const authMiddleware = require('./middlewares/auth');

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, config.options)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log("NOT CONNECTED TO MONGO"));;

// instantiate the app
const app = express();

// const usert = require(`${ __dirname }/routes/usert`);
const user = require(`${ __dirname }/routes/user`);
const site = require(`${ __dirname }/routes/site`);
const roadmap = require(`${ __dirname }/routes/roadmap`);
const generator = require(`${ __dirname }/routes/generator`);
const prac = require(`${ __dirname }/routes/prac`);

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

// app.use(passport.initialize()); // for token based security
// app.use('/usert', usert.router); // encrypted password
// app.use('/prac', prac.router); // playground route

app.use('/user', user.router);
app.use('/site', site.router);
app.use('/activity_roadmap', roadmap.router);
app.use('/generator', generator.router);

// for future image uploading functionality
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${ __dirname}/uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, `${ req.params['username'] }.${file.originalname.split('.')[1]}`)
    }
});

app.use(function (req, res, next) {
    // it was done to allow cross origin request from angular server, leave it uncommented for now, since we are not using angular
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// image upload route, it is in experimental phase for now ...
app.post('/api/:username', function (req, res, next) {
    console.log('username: ' + req.params['username']);
    console.log('file uploaded');
    next();
}, multer({
    storage: storage
}).any());

// tell express to listen to the specified port
app.listen(8000);