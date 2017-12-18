var express = require('express');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var app = express();


app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}))

// Access the session as req.session
app.get('/', function (req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
})

app.get('/t', function (req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
})


app.get('/t.php', function (req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
})
app.listen(5000);
