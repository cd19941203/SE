var app = require('express')();
var http = require('http').Server(app);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://140.121.197.12:9487";
var collection;

MongoClient.connect(url, function (err, db) {
    if (err) {
        return console.dir(err);
    }

    collection = db.collection('SE');
});


app.post('/', function (req, res) {
    //for (var index in req)
    //    console.log(index);
    console.log(req.body);

    res.send('Connection succeeded.');
});

//app.post()

http.listen(9002, function () {
    console.log('Listening on port 9002');
});
