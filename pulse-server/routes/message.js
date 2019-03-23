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
        req.body.usrA,
        req.body.usrB,
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

})

module.exports = {
    router: router
};