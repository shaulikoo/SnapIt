var express = require('express');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var router = express.Router();
var camera = require('../node_modules/Camera/cameraApi');
var camera_info = require('../camera.json');

router.get('/', function (req, res, next) {
    var io = req.io
    camera.pics(function () {
        console.log("emit");
        eventEmitter.emit('ready');
    });

    res.render('wait_cns', {title: "Wait - clicking and shooting", body: 1 , ender: "By Shaul Badusa"});
    io.on("connection", function (socket) {
        console.log('Socket connect');
        eventEmitter.on('ready', function () {
            console.log('ready');
            socket.emit('finish-pics');
        })
    });
});


router.get('/p', function (req, res, next) {
    var image_data = require('../image_data')
    res.render('cns', {title: "The Pics", body: 1, ender: "By Shaul Badusa", image_data: image_data})

});

module.exports=router