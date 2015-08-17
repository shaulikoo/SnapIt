var express = require('express');
var router = express.Router();
var camera=require('../node_modules/Camera/cameraApi');
var ok;


/* GET camera page. */
router.get('/', function(req, res, next){
    ok=camera.pics();
    res.render('wait',{title: 'SnapIt-Hw', time: '4'});
});

router.get('/p', function(req, res, next){
    if (ok==1) {
        var image="/images/1.jpg"
        res.render('index',{title: 'SnapIt-Hw', body: 'The Photo', ender: "This page control the camera",image: image});
    }else{
        res.render('index',{title: 'SnapIt-Hw', body: 'ERROR', ender: "This page control the camera",image: ""});
    }
    ok=0;
});



module.exports = router;
