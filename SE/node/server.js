var express = require("express");
var Server = require("http").Server;
var session = require("express-session");

var app = express();
var server = Server(app);
//var sio = require("socket.io")(server);
var account = require('./account.js');
var database = require('./database.js');
var meal = require('./meal.js');
var socket = require('./socket.js');
var rootPath = '../';


app.use('/js',express.static(__dirname + '/../js'));

app.listen(8787,()=>{
	console.log('server gogo OUO!')}
);

app.get('/test',(req,res)=>{
	res.sendFile('test.html',{root:rootPath});
});

app.get('/',(req,res)=>{
	res.sendFile('index.html',{root:rootPath});
});
