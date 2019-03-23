const express = require('express');
const bodyParser =  require('body-parser');
const bot = require('./routes/route.bot');
const all = require('./routes/route.all');

// instantiate the app
const app = express();

// register the middleware for serving static pages
app.use(express.static(`${ __dirname }/avatars`));
app.use(express.static(`${ __dirname }/public`));

// ALLOW CORS
app.use(function (req, resp, next) {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    resp.header("Access-Control-Allow-Headers", "*");
    next();
})

app.use(function (req, res, next) {
    // it was done to allow cross origin request from angular server,
    // change it to your specific origin server
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// use the routers
app.use('/bot', bot.router);
app.use('/all', all.router);

// tell express to listen to the specified port
app.listen(8001);