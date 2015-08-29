var express = require('express');
var exec = require('child_process').exec;
var fs = require('fs');
var socket_io = require('socket.io')
var events = require('events');
var eventEmitter = new events.EventEmitter();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('express-favicon');
var hash = require('./pass').hash;
var app = express();

app.locals.cam_info = require('./camera.json');
/**
 * Socket.io
 */
var io = socket_io();
app.io = io;

app.use(function(req, res, next) {
    req.io = app.io;
    next();
});

/**
 * modules
 */

var routes = require('./routes/index');
var camera = require('./routes/camera');
var stepper = require('./routes/stepper');
var cns = require('./routes/cns');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
console.log("Server up, Listening to 3000");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('passIn'));
app.use(session({
    secret: 'passIn',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    var err = req.session.error
        , msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

/**
 * Login
 * @type {{shaul: {name: string}}}
 */
var users = {
    shaul: {name: 'shaul'}
};
hash('shaulikoo', function (err, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.shaul.salt = salt;
    users.shaul.hash = hash.toString();
});
function authenticate(name, pass, fn) {
    var user = users[name];
    if (!user) return fn(new Error('cannot find user'));
    hash(pass, user.salt, function (err, hash) {
        if (err) return fn(err);
        if (hash.toString() == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    })
}
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}
app.get('/', function (req, res) {
    res.redirect('login');
});
app.get('/restricted', restrict, function (req, res) {
    res.redirect('/home');
});
app.get('/logout', function (req, res) {
    eventEmitter.emit('del');
    req.session.destroy(function () {
        res.redirect('/');
    });
});
app.post('/login', function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                res.redirect('/home');
            });
        } else {
            res.redirect('login');
        }
    });
});

/**
 * Routing
 */
app.get('/login', function (req, res) {
    res.render('login');
});
app.use('/home', restrict, routes);
app.use('/camera', restrict, camera);
app.use('/stepper', restrict, stepper);
app.use('/cns', restrict, cns);
app.get('/shutdown', function(req,res){
    exec("sudo shutdown -h 0");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});





// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

eventEmitter.on('del', function () {
    var dirpath = '/home/pi/public/images';
    var rmDir = function (dirPath) {
        try {
            var files = fs.readdirSync(dirPath);
        }
        catch (e) {
            return;
        }
        console.log("emit");
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    rmDir(filePath);
            }
    };
    rmDir(dirpath);
});

module.exports = app;

