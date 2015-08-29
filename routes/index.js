var express = require('express');
var router = express.Router();
var camera = require('../node_modules/Camera/cameraApi');
var events = require('events');

var eventEmitter = new events.EventEmitter();
var state, freespace;

router.use(function (req,res,next) {
    camera.get_data(function (data,space) {
        console.log(space);
        freespace = space;
        state = data;
        next();
        eventEmitter.emit('render')
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    eventEmitter.once('render', function () {
        res.render('index', {title: "Welcome", body: state, ender: "By Shaul Badusa"})
    })
 });

module.exports = router;



