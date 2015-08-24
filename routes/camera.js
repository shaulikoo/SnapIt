var express = require('express');
var router = express.Router();
var camera=require('../node_modules/Camera/cameraApi');
var ok;


/* GET camera page. */
router.get('/', function(req, res, next){
    ok = camera.one()
    res.render('wait',{title: 'SnapIt-Hw', time: '5'});
});

router.get('/p', function(req, res, next){
    console.log(ok)
    if (ok != 0) {
        var image=ok
        res.render('index',{title: 'SnapIt-Hw', body: 'The Photo', ender: "This page control the camera",image: image});
    }else{
        res.render('index',{title: 'SnapIt-Hw', body: 'ERROR', ender: "This page control the camera",image: ""});
    }
    ok=0;
});

router.get('/download', function(req, res){
    var file='C:/Users/shaul/WebstormProjects/SnapIt/public/images/1.jpg'
    res.download(file); // Set disposition and send it.
});

module.exports = router;
