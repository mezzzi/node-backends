const router = require('express').Router();
const AllController = require('../controllers/controller.all').AllController;

router.get('/', function (req, res) {

    AllController.getAll(
        function (result) {
            res.json(result);
        },
        function (err) {
            res.json(err);
        }
    );

});

router.get('/pages', function (req, res) {

    AllController.getPages(
        function (result) {
            res.send(result);
        },
        function (err) {
            res.json(err);
        }
    );

});

router.get('/randoms', function (req, res) {

    AllController.getRandoms(
        function (result) {
            res.json(result);
        },
        function (err) {
            res.json(err);
        }
    );

});

router.get('/audios', function (req, res) {

    AllController.getAudios(
        function (result) {
            res.json(result);
        },
        function (err) {
            res.json(err);
        }
    );

});

router.get('/one', function (req, res) {

    AllController.getOne(
        function (result) {
            res.json(result);
        },
        function (err) {
            res.json(err);
        }
    );

});

module.exports = {
    router: router
}
