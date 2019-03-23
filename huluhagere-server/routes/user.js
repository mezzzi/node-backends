const mongoose = require('mongoose');
const config = require('../config/database');
const express = require("express");

const userManager = require('../models/userManager');

const router = express.Router();

// get all users
router.get('/all/', function (req, res) {
    userManager.getAllUsers(
        function (usrs) {
            res.json(usrs);
        },
        function (err) {
            res.json([]);
        })
});

// get all users
router.get('/one/', function (req, res) {
    userManager.searchUser(
        req.query.email,
        function (usr) {
            res.json({
                success: true,
                user: usr
            });
        },
        function (err) {
            res.json({
                success: false,
                error: err
            });
        })
});

// remove all users
router.post('/remove-all/', function (req, res) {
    userManager.removeAllUsers(
        function () {
            res.json({
                sucess: true,
                message: "All users successfully deleted"
            });
        },
        function (err) {
            res.json({
                success: false,
                error: err
            });
        })
});

// remove all users
router.post('/remove-one/', function (req, res) {
    userManager.removeUser(
        req.body,
        function () {
            res.json({
                sucess: true,
                message: "User successfully deleted"
            });
        },
        function (err) {
            res.json({
                success: false,
                error: err
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
                error: "",
                message: 'You are successfully registered!'
            });
        },
        function (err) {
            res.json({
                success: false,
                error: err,
                message: 'Email already exists!'
            });
        }
    );

})

// register a user
router.post('/update/', function (req, res) {

    userManager.updateUser(
        req.body.old,
        req.body.update,
        function (usr) {
            res.json({
                success: true,
                message: 'User successfully updated!',
                user: usr
            });
        },
        function (err) {
            res.json({
                success: false,
                error: err,
                message: 'Update failed!'
            });
        }
    );

})


router.post('/login/', function (req, res) {

    // print for debugging
    console.log(JSON.stringify(req.body));

    userManager.findUser(
        req.body,
        function () {
            let resp = {
                success: true,
                message: "You are successfully logged in!",
                error: ""
            };
            if(req.body.email === "root@gmail.com"){
                resp.is_admin = true;
            } else {
                resp.is_admin = false;
            }
            res.json(resp);
        },
        function (err) {
            res.json({
                success: false,
                error: err,
                message: 'Invalid email and password!'
            });
        }
    )

});

module.exports = {
    router: router
};