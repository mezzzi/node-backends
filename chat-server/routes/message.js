const mongoose = require('mongoose');
const express = require("express");

const msgManager = require('../models/messageManager');

const router = express.Router();

router.post('/save/', function (req, res) {

    msgManager.saveMessage(req.body, 
    function(msg) {
        res.json({
            success: true,
            message: msg,
        });
    },
    function() {
        res.json({
            success: false
        });
    })

});

router.post('/fetch/', function (req, res) {

    msgManager.getMessages(
        req.body.session_id,
        function (msgs) {
            res.json({
                success: true,
                msgs: msgs
            });
        },
        function () {
            res.json({
                success: false,
            });
        }
    );

});

router.get('/fetch/:session_id/', function (req, res) {

    msgManager.getMessages(
        req.params.session_id,
        function (msgs) {
            res.json({
                success: true,
                msgs: msgs
            });
        },
        function () {
            res.json({
                success: false,
            });
        }
    );

});

router.post('/remove/', function (req, res) {

    msgManager.getMessages(
        req.body.id,
        function () {
            res.json({
                success: true
            });
        },
        function () {
            res.json({
                success: false,
            });
        }
    );

});

module.exports = {
    router: router
};