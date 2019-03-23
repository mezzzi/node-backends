const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();
let file_name = '';

// ALLOW CORS
app.use(function (req, resp, next) {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    resp.header("Access-Control-Allow-Headers", "*");
    next();
})

// register the middleware for serving static pages
app.use(express.static(`${ __dirname }/uploads`));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${ __dirname}/uploads`)
    },
    filename: function (req, file, cb) {
        const file_extension = file.originalname.split('.')[1];
        file_name = `${Date.now()}.${file_extension}`;
        cb(null, `${ file_name }`);
    }
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/images/', function (req, res, next) {
        next();
    },
    multer({
        storage: storage
    }).any(),
    function (req, res, next) {
        res.json({
            success: true,
            file_name: file_name
        })
    });

app.listen(8000);