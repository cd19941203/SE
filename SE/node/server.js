var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var app = express();
var server = Server(app);
var sio = require("socket.io")(server);

var account = require('./account.js');
var database = require('./database.js');
var meal = require('./meal.js');

var rootPath = '../www/';

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
	app.use(formData.parse(multipartyOptions));
	app.use(formData.format());
	app.use(formData.stream());
	app.use(formData.union());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	/////
	// web service and socket setting
	app.use('/js',express.static(__dirname + '/../www/js'));
	//app.use('/',express.static(__dirname + '/../www'));
	/////
	//let we can get connection session from socket
	var sessionMiddleware = session({
		secret: "keyboard cat",
		cookie:{maxAge:60*1000}
	});
	
	sio.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	app.use(sessionMiddleware);
	/////
	
	// middleware for checking user authentication
	// 路徑不包含loginCheck的request 都會跑這個function檢查有沒有登入OUO
	app.use(/^(?:(?!loginCheck).)*$/,(req,res,next)=>{
		if(!(req.session.valid==true))
			res.sendFile('login.html',{root:rootPath});
		else
			next();
	});
	/////
	// start here
	
	app.post('/loginCheck',(req,res)=>{
		var account = req.body.account;
		var password = req.body.password;
		console.log(req.body);
		res.send("123");
	});
	
	// 用來假裝登入der
	app.get('/loginCheck',(req,res)=>{
		req.session.valid = true;
		req.session.account = req.query.account;
		res.send('hello');
	});
	
	app.get('/logout',(req,res)=>{
		req.session.destroy();
	});

	app.get('/test',(req,res)=>{
		res.sendFile('test.html',{root:rootPath});
	});
	
	app.get('/getMenu',async(req,res)=>{
		try{
			var result = await meal.getMenu();
			res.send(result);
		}catch(err){
			res.send({});
		}
	});
	
	app.listen(8787,()=>{
		console.log('server gogo OUO!')}
	);

}

init();
