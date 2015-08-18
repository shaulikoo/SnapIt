var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');


var options_py = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/pywork',
    args: []
};

function proc(callback)
    {
        //PythonShell.run('click_shoot_run.py',options_py ,function (err) {
        //    if (err) res.render('index', {title: "Error", body: 'CnS', ender: "Shaul Badusa", image: ""})
        //})
        callback()
    };

/* GET home page. */
router.get('/', function(req, res, next) {
    proc(function(){
    res.render('index', {title: "Work", body: 'CnS', ender: "Shaul Badusa", image: ""})}
    )});


module.exports = router;