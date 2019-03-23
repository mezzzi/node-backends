const mongoose = require('mongoose');
const config = require('../config/database');
const express = require("express");

const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);
const userManager = require('../models/userManager');

const router = express.Router();

let capitalize = function (word) {
    return word[0].toUpperCase() + word.substring(1, word.length);
};

const authMiddleware = require('../middlewares/auth');

router.get('/all/', authMiddleware.jwtAuth, function (req, res) {
    userManager.getAllUsers(
    function(usrs) {
        res.json({
            success: true,
            usrs: usrs,
        });
    },
    function() {
        res.json({
            success: false
        });
    })
});

router.post('/register/', function (req, res) {

    let username = req.body.username.trim();
    let password = req.body.password.trim();

    userManager.registerUser(
        {
            username: username,
            password: password
        },
        function () {
            res.json({
                success: true,
                username: capitalize(username),
                message: 'You are successfully registered!'
            });
        },
        function () {
            res.json({
                success: false,
                username: 'Guest User',
                message: 'Username already exists!'
            });
        }
    );

})

router.post('/login/', function (req, res) {

    let username = req.body.username.trim();
    let password = req.body.password.trim();

    userManager.findUser(
        {
            username: username,
            password: password
        },
        function (token) {
            res.json({
                success: true,
                token: 'JWT ' + token,
                message: "You are successfully logged in!"
            });
        },
        function () {
            res.json({
                success: false,
                message: 'Invalid username and password!'
            });
        }
    )

});

module.exports = {
    router: router
};