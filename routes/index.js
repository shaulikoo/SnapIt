var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: "SnapIt-Hw" , body: 'Welcome to SnapIt-Hw', ender : "Shaul Badusa",image: "" ,download:false});
});

module.exports = router;
