var express = require('express');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var router = express.Router();
var camera = require('../node_modules/Camera/cameraApi');
var ok = 0;

/* GET camera page. */

router.get('/', function (req, res, next) {
    var data = require('../camera.json');
    res.render('form', {title: 'Choose setup',body:1, data: data, space: res.freespace});
});


router.post('/wait', function (req, res, next) {
    var flash = req.body.flash;
    function check(cb) {
        if (flash != 'on' && flash != 'off') res.redirect('/camera/')
        if (flash == 'on')
        {
            flash = '1'
            cb()
        }
        else{ if (flash == 'off') {
            flash = '0'
            cb()
        }
    }}
    check(function(){
        camera.one(flash, function (impath) {
        console.log("ready");
        ok = impath;
        eventEmitter.emit("ready")
    });
    res.render('wait', {title: 'Shooting Preview',body: 1, time: '5'});
})});

router.get('/p', function (req, res, next) {
    var io = req.io;
    res.render('preview', {
        title: 'Preview',
        body: 1,
        ender: "By Shaul Badusa",
    });
    io.on("connection", function (socket) {
        console.log("Socket Connect");
        eventEmitter.on("ready", function () {
            console.log("emit");
            console.log(ok);
            socket.emit('finish-pics', ok);
        });
    });
});

router.get('/download', function (req, res) {
    var file = '/home/pi/public/' + ok.toString()
    res.download(file);
});


module.exports = router;
