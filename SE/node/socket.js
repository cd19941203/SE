var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var session = require('express-session');
var sharedsession = require("express-socket.io-session");
var Session = session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    },
    resave: true,
    saveUninitialized: true
});

/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://140.121.197.12:9487";
var collection;

MongoClient.connect(url, function (err, db) {
    if (err) {
        return console.dir(err);
    }

    collection = db.collection('SE');
});
*/

var logStream = fs.createWriteStream('log.txt', {
    'flags': 'a'
});

var sockets = [];

app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    },
    resave: true,
    saveUninitialized: true
}))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.use(sharedsession(Session, {
    autoSave: true
}));

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log(new Date().toISOString() + " user disconnected: " + this.userId);

        //delete socket.handshake.session.userId;
        //socket.handshake.session.save();

        logStream.write(new Date().toISOString() + " user disconnected: " + this.userId + "\r\n");
    });


    console.log(socket.handshake.session.userId);
    if (socket.handshake.session.userId)
        this.userId = socket.handshake.session.userId;
    else
        socket.emit('userIdRequest');
    socket.on('userId', function (userId) {
        if (userId == undefined || userId == "") {
            socket.emit('userIdRequest');
            return;
        }

        this.userId = userId;


        socket.handshake.session.userId = userId;
        socket.handshake.session.save();


        console.log(new Date().toISOString() + " a user connected: " + this.userId);

        logStream.write(new Date().toISOString() + " a user connected: " + this.userId + "\r\n");

        sockets.push(this);
    });

    socket.on('new order', function (msg) {
        console.log(new Date().toISOString() + ' ' + this.userId + ' new order: ' + msg);
        logStream.write(new Date().toISOString() + ' ' + this.userId + ' new order: ' + msg + "\r\n");

        msg = JSON.parse(msg);
        msg["userId"] = this.userId;
        msg = JSON.stringify(msg);

        for (var s of sockets)
            if (s.userId == "admin")
                s.emit('new order', msg);
    });

    socket.on('order response', function (msg) {
        console.log(new Date().toISOString() + ' ' + this.userId + ' order response: ' + msg);
        logStream.write(new Date().toISOString() + ' ' + this.userId + ' order response: ' + msg + "\r\n");

        msg = JSON.parse(msg);
        var userId = msg["customer"];
        msg = JSON.stringify(msg);

        for (var s of sockets)
            if (s.userId == userId)
                s.emit('order response', msg);
    });


});

http.listen(9003,
    function () {
        console.log('listening on *:9003');
    });
