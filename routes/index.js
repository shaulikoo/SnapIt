var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: "SnapIt" , body: 'Welcome to SnapIt', ender : "The best app",image: "" });
});

module.exports = router;
