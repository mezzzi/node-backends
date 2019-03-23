const express = require("express");
const roadmapManager = require('../models/roadmapManager');
const router = express.Router();

router.get('/all/', function (req, res) {
    console.log(req.query.email);
    roadmapManager.findAll(
        req.query.email,
        function (roadmaps) {
            res.json(roadmaps);
        },
        function (err) {
            res.json([]);
        })
});

router.post('/save/', function (req, res) {
    console.log("SAVE BODY");
    console.log(req.body);
    roadmapManager.saveRoadmap(
        req.body,
        function () {
            res.json({
                success: true,
                error: "",
                message: "Roadmap Successfully Saved"
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "Roadmap could not be saved",
                error: err
            });
        })
});

router.post('/add-activity/', function (req, res) {
    roadmapManager.addActivity(
        req.body.id,
        req.body.activity,
        function () {
            res.json({
                sucess: true,
                message: "Activity successfully added",
                error: ""
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "Activity could not be added",
                error: err
            });
        })
});

router.post('/remove-activity/', function (req, res) {
    roadmapManager.removeActivity(
        req.body.roadmap_id,
        req.body.activity_id,
        function () {
            res.json({
                sucess: true,
                message: "Activity successfully deleted",
                error: ""
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "Activity could not be deleted",
                error: err
            });
        })
});

router.post('/remove/', function (req, res) {
    roadmapManager.removeRoadmap(
        req.body.name,
        function () {
            res.json({
                sucess: true,
                message: "Roadmap successfully deleted",
                error: ""
            });
        },
        function (err) {
            res.json({
                success: false,
                message: "Roadmap could not be deleted",
                error: err
            });
        })
});

module.exports = {
    router: router
};
