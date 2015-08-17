var express = require('express');
var router = express.Router();
var stepper = require('../node_modules/Stepper/StepperApi');
var ok;


/* GET home page. */
router.get('/', function(req, res, next) {
    //ok=stepper.step(10);
    res.render('index', { title: "SnapIt-Hw" , body: 'This is The stepper Page', ender : "Shaul Badusa",image: "",download:false });
});

module.exports = router;
