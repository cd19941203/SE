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
	
	var bossOnlyAPI = ['/getNewOrder'];

	app.use(bossOnlyAPI,(req,res,next)=>{
		if(req.session.account!='boss')
			res.send('get out');
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

		// 把各個user加入個別的room,即可一次對該user的所有socket emit
		// unfortunately socket.join is asynchronous... 
		socket.join(socket.request.session.account,()=>{
			
			// from customer
			socket.on('newOrder',async(data)=>{
				try{
					var newOrder = JSON.parse(data);
					newOrder['account'] = socket.request.session.account;
					newOrder['orderNumber'] = await setting.getOrderNumber();
					newOrder['status'] = 'new';
					newOrder['beginTime'] = new Date();
					order.newOrder(newOrder);
					delete newOrder['_id'];
					// ack customer
					sio.to(socket.request.session.account).emit('newOrder',{orderNumber:newOrder['orderNumber'],status:'success'});
					// to boss
					sio.to('boss').emit('newOrder',newOrder);
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to(socket.request.session.account).emit('newOrder',{status:'Data format error'});
					}else{
						sio.to(socket.request.session.account).emit('newOrder',{status:err});	
					}
				}
			});

			// from boss
			socket.on('orderAccept',data=>{
				var orderNumber;
				try{
					var orderAccept = JSON.parse(data);
					orderNumber = orderAccept['orderNumber'];
					Promise.all([
						order.getOrderData(orderNumber),
						order.orderStatusChange(orderNumber,order.orderStatus['accepted'])
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderAccept',{orderNumber:orderNumber,status:'success'});
						sio.to(account).emit('orderAccept',{orderNumber:orderNumber});
					}).catch(err=>{
						throw(err);
					});
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to('boss').emit('orderAccept',{status:'Data format error'});
					}
					else{
						sio.to('boss').emit('orderAccept',{orderNumber:orderNumber,status:err});
					}
				}
			});

			// from boss
			socket.on('orderComplete',data=>{
				var orderNumber;
				try{
					var orderComplete = JSON.parse(data);
					orderNumber = orderComplete['orderNumber'];
					Promise.all([
						order.getOrderData(orderNumber),
						order.orderStatusChange(orderNumber,order.orderStatus['completed'])
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderComplete',{orderNumber:orderNumber,status:'success'});
						sio.to(account).emit('orderComplete',{orderNumber:orderNumber});
					}).catch(err=>{
						throw(err);
					});
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to('boss').emit('orderAccept',{status:'Data format error'});
					}
					else{
						sio.to('boss').emit('orderAccept',{orderNumber:orderNumber,status:err});
					}
				}
			});

			socket.on('orderDone',data=>{
				var orderNumber;
				try{
					var orderDone = JSON.parse(data);
					orderNumber = orderDone['orderNumber'];
					Promise.all([
						order.getOrderData(orderNumber),
						order.orderStatusChange(orderNumber,order.orderStatus['done'])
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderDone',{orderNumber:orderNumber,status:'success'})
						sio.to(account).emit('orderDone',{orderNumber:orderNumber});
					}).catch(err=>{
						throw(err);
					});
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to('boss').emit('orderDone',{status:'Data format error'});
					}
					else{
						sio.to('boss').emit('orderDone',{orderNumber:orderNumber,status:err});
					}
				}
			});

			socket.on('orderModify',data=>{
				var orderNumber;
				try{
					var orderModify = JSON.parse(data);
					orderNumber = orderModify['orderNumber'];
					var advice = orderModify['advice'];
					Promise.all([
						order.getOrderData(orderNumber),
						order.orderStatusChange(orderNumber,order.orderStatus['pending']),
						order.updateModifyAdvice(orderNumber,advice)
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderModify',{orderNumber:orderNumber,status:'success'})
						sio.to(account).emit('orderModify',{orderNumber:orderNumber,advice:advice});
					}).catch(err=>{
						throw(err);
					});
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to('boss').emit('orderModify',{status:'Data format error'});
					}
					else{
						sio.to('boss').emit('orderModify',{orderNumber:orderNumber,status:err});
					}
				}
			});

			socket.on('orderRes',async(data)=>{
				var orderNumber;
				try{
					var orderRes = JSON.parse(data);
					orderNumber = orderRes['orderNumber'];
					orderRes['status'] = 'new';
					orderRes['beginTime'] = new Date();
					await order.changeOrder(orderRes);
					delete orderRes['_id'];
					sio.to(socket.request.session.account).emit('orderRes',{orderNumber:orderNumber,status:'success'});
					sio.to('boss').emit('newOrder',orderRes);
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to(socket.request.session.account).emit('orderRes',{status:'Data format error'});
					}
					else{
						sio.to(socket.request.session.account).emit('orderRes',{orderNumber:orderNumber,status:err});
					}
				}
			});

			socket.on('orderCancel',async(data)=>{
				var orderNumber;
				var source = socket.request.session.account;
				var target;
				try{
					var orderCancel = JSON.parse(data);
					orderNumber = orderCancel['orderNumber'];
					var orderData = await order.getOrderData(orderNumber);
					if(source == 'boss') 
						target = orderData['account'];
					else 
						target = 'boss';

					await order.orderStatusChange(orderNumber,order.orderStatus['canceled']);
					sio.to(target).emit('orderCancel',{account:orderData['account'],orderNumber:orderNumber});
					sio.to(source).emit('orderCancel',{orderNumber:orderNumber,status:'success'});
				}catch(err){
					if(err instanceof SyntaxError){
						sio.to(source).emit('orderCancel',{status:'Data format error'});
					}
					else{
						sio.to(source).emit('orderCancel',{orderNumber:orderNumber,status:err});
					}
				}
			});

		});	// socket.join
    });



	////////////////////////////////////////////////////////////
	// about web server
	
	// login and logout
	app.post('/loginCheck',(req,res)=>{
		var account = req.body.account;
		var password = req.body.password;
		console.log(req.body);
		console.log(account);
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

	// route
	app.get('/index',(req,res)=>{
		var m = req.query.m;

	});


	// testing socket

	app.get('/client',(req,res)=>{
		res.sendFile('client.html',{root:rootPath});

	});

	app.get('/boss',(req,res)=>{
		res.sendFile('boss.html',{root:rootPath});
	});

	// API

	app.get('/getNewOrder',async(req,res)=>{
		try{
			var data = await order.getNewOrder();
			res.send(data);
		}catch(err){
			res.send(err);
		}
	});

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
