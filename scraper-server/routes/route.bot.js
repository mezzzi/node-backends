const router = require('express').Router();
const BotController = require('../controllers/controller.bot').BotController;

router.get('/:type/', function (req, res) {

    console.log(JSON.stringify(req.query));
    if (!req.query['category']) {
        res.json({
            success: false,
            message: "required parameter category not provided"
        })
    } else {
        BotController.getAllBots(
            req.params['type'],
            req.query['category'],
            function (bots) {
                res.json({
                    success: true,
                    bots: bots
                });
            },
            function (err) {
                res.json({
                    success: false,
                    message: err
                });
            }
        );
    }

})

module.exports = {
    router: router
}