const mongoose = require('mongoose');
const config = require('../config/database');
const express = require("express");

const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);
const userManager = require('../models/usertManager');

const router = express.Router();

let capitalize = function (word) {
    return word[0].toUpperCase() + word.substring(1, word.length);
};

const authMiddleware = require('../middlewares/auth');

// get all users
router.get('/all/', function (req, res) {
    userManager.getAllUsers(
    function(usrs) {
        res.json(usrs);
    },
    function(err) {
        res.json({
            success: false,
            err: err
        });
    })
});

// remove all users
router.post('/remove-all/', function (req, res) {
    userManager.removeAllUsers(
    function() {
        res.json({
            sucess: true,
            message: "All users successfully deleted"
        });
    },
    function(err) {
        res.json({
            success: false,
            err: err
        });
    })
});

// register a user
router.post('/register/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    userManager.registerUser(
        req.body,
        function () {
            res.json({
                success: true,
                email: req.body.email,
                message: 'You are successfully registered!'
            });
        },
        function (err) {
            res.json({
                success: false,
                email: req.body.email,
                err: err,
                message: 'Email already exists!'
            });
        }
    );

})

router.post('/login/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    userManager.findUser(
        req.body,
        function (token) {
            res.json({
                success: true,
                token: 'JWT ' + token,
                message: "You are successfully logged in!"
            });
        },
        function (err) {
            res.json({
                success: false,
                err: err,
                message: 'Invalid email and password!'
            });
        }
    )

});

module.exports = {
    router: router
};