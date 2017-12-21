var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var app = express();
var server = Server(app);
var sio = require("socket.io")(server);

var account = require('./account.js');
var database = require('./database.js');
var meal = require('./meal.js');

var rootPath = '../';

var bodyParser = require('body-parser');
var formData = require("express-form-data");
var multipartyOptions = {
  autoFiles: true
};
 

async function init(){
	
	try{
		var conn = await database.connect();
	}catch(err){
		// db connection failed
		console.log(err);
		//process.exit();
	}
	/////
	// setting for parsing post data
	
	// parse a data with connect-multiparty. 
	app.use(formData.parse(multipartyOptions));
	// clear all empty files (size == 0)
	app.use(formData.format());
	// change file objects to node stream.Readable 
	app.use(formData.stream());
	// union body and files
	app.use(formData.union());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	}));
	/////
	// web service and socket setting
	app.use('/js',express.static(__dirname + '/../js'));
	var sessionMiddleware = session({
		//store: new RedisStore({}), // XXX redis server config
		secret: "keyboard cat",
		cookie:{maxAge:60*1000}
	});
	sio.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	app.use(sessionMiddleware);
	/////
	
	/////
	// start here
	
	app.post('/login',(req,res)=>{
		var account = req.body.account;
		var password = req.body.password;
		console.log(req.body);
		res.send("123");
	});
	
	app.get('/test',(req,res)=>{
		res.sendFile('test.html',{root:rootPath});
	});
	
	app.get('/',(req,res)=>{
		res.sendFile('index.html',{root:rootPath});
	});
	
	app.listen(8787,()=>{
		console.log('server gogo OUO!')}
	);

}

init();
