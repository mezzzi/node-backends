const RoadMapGenerator = require('../controllers/generator');
const express = require("express");
const router = express.Router();


router.post('/roadmap/', function (req, res) {

    RoadMapGenerator.generate(

        req.body,

        function (roadmap) {
            res.json(roadmap);
        },

        function (err) {
            res.json({
                success: false,
                err: err,
                "message": "Roadmap could not be generated"
            });
        }
    );

})

module.exports = {
    router: router
};