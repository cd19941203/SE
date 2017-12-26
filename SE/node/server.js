var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var app = express();
var server = Server(app);
var sio = require("socket.io")(server);
var bodyParser = require('body-parser');
var formData = require("express-form-data");
var socket = require('./order.js');
var account = require('./account.js');
var database = require('./database.js');
var meal = require('./meal.js');
var setting = require('./setting.js');
var order = require('./order.js');

var rootPath = '../www/';
var multipartyOptions = {
	autoFiles: true
};


// yoooooooooooooooooooooooooooooo

async function init(){
	
	////////////////////////////////////////////////////////////
	// setting for parsing post data
	app.use(formData.parse(multipartyOptions));
	app.use(formData.format());
	app.use(formData.stream());
	app.use(formData.union());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	////////////////////////////////////////////////////////////
	// web service and socket setting
	app.use('/js',express.static(__dirname + '/../www/js'));
	//app.use('/',express.static(__dirname + '/../www'));
	////////////////////////////////////////////////////////////
	//let we can get connection session from socket
	var sessionMiddleware = session({
		secret: "keyboard cat",
		cookie:{maxAge:60*10000}
	});

	sio.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	
	app.use(sessionMiddleware);
	////////////////////////////////////////////////////////////
	
	// middleware for checking user authentication
	// 路徑不包含loginCheck的request 都會跑這個function檢查有沒有登入OUO
	
	app.use(/^(?:(?!loginCheck).)*$/,(req,res,next)=>{
		if(!(req.session.valid==true))
			res.sendFile('login.html',{root:rootPath});
		else
			next();
	});
	
	////////////////////////////////////////////////////////////
	//---------------------- start here ----------------------//

	// about socket 

	sio.sockets.on('connection', async(socket)=>{
		console.log('new socket connection');
		var user = socket.request.session.account;
		

		if(typeof(user) === "undefined")
			return ;

		console.log(user);
		if(user == 'boss'){
			var bossNotAckOrder = await order.getNotAckOrder();
			console.log(bossNotAckOrder);
		}
		// if account is boss
		// 查出所有還沒有得到boss ack的訂單 全部再送一次

		// if account is customer
		// resend all order without commited ???



		// 把各個user加入個別的room,即可一次對該user的所有socket emit
		// unfortunately socket.join is asynchronous... 
		socket.join(socket.request.session.account,()=>{
			
			// from customer
			socket.on('newOrder',async(data)=>{
				console.log("here comes a new order");
				var newOrder = JSON.parse(data);
				newOrder['account'] = socket.request.session.account;
				newOrder['orderNumber'] = await setting.getOrderNumber();
				newOrder['status'] = 'new';
				newOrder['beginTime'] = new Date();
				order.newOrder(newOrder);
				delete newOrder['_id'];
				// to boss
				sio.to('boss').emit('newOrder',newOrder);
			});

			// from boss
			socket.on('orderAck',async(data)=>{
				var orderAck = JSON.parse(data);
				order.orderAck(orderAck);
				delete orderAck['_id'];
				// to customer
				sio.to(orderAck['account']).emit('orderAck',orderAck);
			});

			// from boss
			socket.on('orderComplete',async(data)=>{
				var orderComplete = JSON.parse(data);
				order.orderComplete(orderComplete);
				delete orderComplete['_id'];
				// to customer
				sio.to(orderComplete['account']).emit('orderComplete',orderComplete);
			});

			// from boss // 以取餐 訂單完成
			socket.on('orderEnd',async(data)=>{
				var orderEnd = JSON.parse(data);
				orderEnd['endTime'] = new Date();
				order.orderEnd(orderEnd);
				// to customer
				//sio.to(orederEnd['user']).emit('orderEnd',orderComplete);
			});
		});	
    });



	////////////////////////////////////////////////////////////
	// about web server
	
	app.post('/loginCheck',(req,res)=>{
		var account = req.body.account;
		var password = req.body.password;
		console.log(req.body);
		res.sendFile('index.html',{root:rootPath});
	});
	
	// 用來假裝登入der
	app.get('/loginCheck',(req,res)=>{
		req.session.valid = true;
		req.session.account = req.query.account;
		//console.log(req.session.account);
		res.send('hello');
	});
	
	app.get('/logout',(req,res)=>{
		req.session.destroy();
	});

	app.get('/test',(req,res)=>{
		res.sendFile('test.html',{root:rootPath});
	});
	
	// testing socket

	app.get('/client',(req,res)=>{
		res.sendFile('client.html',{root:rootPath});

	});

	app.get('/boss',(req,res)=>{
		res.sendFile('boss.html',{root:rootPath});
	});
	//

	app.get('/getMenu',async(req,res)=>{
		try{
			var result = await meal.getMenu();
			res.send(result);
		}catch(err){
			res.send({});
		}
	});
	
	server.listen(8787,()=>{
		console.log('server gogo OUO!');
	});
}

init();
