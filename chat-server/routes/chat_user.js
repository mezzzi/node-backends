const mongoose = require('mongoose');
const express = require("express");
const userManager = require('../models/ChatUserManager');

const router = express.Router();


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

router.post('/register/', function (req, res) {

    userManager.registerUser(
        req.body,
        function () {
            res.json({
                success: true,
                message: 'You are successfully registered!'
            });
        },
        function (err) {
            res.json({
                success: false,
                err: err,
                message: 'Username already exists!'
            });
        }
    );

})

router.post('/login/', function (req, res) {

    userManager.findUser(
        {
            name: req.name
        },
        function (token) {
            res.json({
                success: true,
                message: "You are successfully logged in!"
            });
        },
        function (err) {
            res.json({
                success: false,
                err: err,
                message: 'Invalid username and password!'
            });
        }
    )

});

module.exports = {
    router: router
};