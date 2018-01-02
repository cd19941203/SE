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

var rootPath = '../html/';
var multipartyOptions = {
	autoFiles: true
};

function getDate(){
	var x = new Date();
	x.setHours(x.getHours()+8);
	return x;
	//return new Date(x.getTime() + 8*3600000);
}

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
	app.use('/js',express.static(__dirname + '/../html/js'));
	app.use('/css',express.static(__dirname + '/../html/css'));
	app.use('/image',express.static(__dirname + '/../html/image'));
	app.use('/fonts',express.static(__dirname + '/../html/fonts'));
	//app.use('/',express.static(__dirname + '/../www'));
	////////////////////////////////////////////////////////////
	//let we can get connection session from socket
	var sessionMiddleware = session({
		secret: "keyboard cat",
		cookie:{maxAge:60*30000}
	});

	sio.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	
	app.use(sessionMiddleware);
	////////////////////////////////////////////////////////////
	
	// middleware for checking user authentication
	// 路徑不包含loginCheck的request 都會跑這個function檢查有沒有登入OUO
	
	app.use(/^(?:(?!index).)*$/,(req,res,next)=>{
		if(!(req.session.valid==true))
			res.sendFile('login.html',{root:rootPath});
		else
			next();
	});
	
	/*
	var bossOnlyAPI = ['/getOrderList'];

	app.use(bossOnlyAPI,(req,res,next)=>{
		if(req.session.account!='boss')
			res.send('get out');
		else
			next();
	});
	*/

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
					newOrder['beginTime'] = getDate();
					await order.newOrder(newOrder);
					newOrder['userInfo'] = account.getUserInfo(socket.request.session.account);
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
						sio.to(account).emit('orderAccept',{orderNumber:orderNumber,meal:values[0]['meal'],totalPrice:values[0]['totalPrice']});
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
						sio.to(account).emit('orderComplete',{orderNumber:orderNumber,meal:values[0]['meal'],totalPrice:values[0]['totalPrice']});
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
						order.orderDone(orderNumber,getDate())
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderDone',{orderNumber:orderNumber,status:'success'})
						sio.to(account).emit('orderDone',{orderNumber:orderNumber,meal:values[0]['meal'],totalPrice:values[0]['totalPrice']});
					}).catch(err=>{
						throw(err);
					});
				}catch(err){
                    console.log(err);
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
					var newMeal = orderModify['meal'];
					Promise.all([
						order.getOrderData(orderNumber),
						order.orderStatusChange(orderNumber,order.orderStatus['pending']),
						order.updateModifyAdvice(orderNumber,advice),
						order.updateOrder(orderNumber,{meal:newMeal})
					]).then(values=>{
						var account = values[0]['account'];
						sio.to('boss').emit('orderModify',{orderNumber:orderNumber,status:'success'})
						sio.to(account).emit('orderModify',{orderNumber:orderNumber,meal:newMeal,advice:advice});
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
					await order.updateOrder(orderNumber,{status:'new',meal:orderRes['meal'],totalPrice:orderRes['totalPrice'],expectTime:['expectTime'],beginTime:orderRes['beginTime']});
					orderRes['userInfo'] = account.getUserInfo(socket.request.session.account);
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
					
					delete orderData['status'];
					delete orderData['expectTime'];
					delete orderData['advice'];
					delete orderData['beginTime'];
					delete orderData['endTime'];

					if(target == 'boss'){
						orderData['userInfo'] = await account.getUserInfo(orderData['account']);
					}

					sio.to(target).emit('orderCancel',orderData);
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
	app.post('/index',async(req,res)=>{
		try{
			var acc = req.body.account;
			var password = req.body.password;
			var status = await account.login(acc,password);
            if(status == true){
				req.session.valid = true;
				req.session.account = acc;
				if(acc == 'boss')
					res.sendFile('boMenu.html',{root:rootPath});
				else
					res.sendFile('cuMenu.html',{root:rootPath});
			}
			else{
				res.sendFile('login.html',{root:rootPath});
			}
		}catch(err){
			console.log(err);
			res.sendFile('login.html',{root:rootPath});
		}
	});

	app.get('/logout',(req,res)=>{
		req.session.destroy();
		res.sendFile('login.html',{root:rootPath});
	});

	// route
	app.get('/index',(req,res)=>{
		var m = req.query.m;
		if(typeof m === "undefined"){
			if(req.session.account == 'boss'){
				res.sendFile('boMenu.html',{root:rootPath});
			}
			else{
				res.sendFile('cuMenu.html',{root:rootPath});
			}
		}
		else
			res.sendFile(m+'.html',{root:rootPath});
	});


	// testing socket

	app.get('/client',(req,res)=>{
		res.sendFile('client.html',{root:rootPath});

	});

	app.get('/boss',(req,res)=>{
		res.sendFile('boss.html',{root:rootPath});
	});

	// API

	app.get('/getOrderList',async(req,res)=>{
		try{
			var status = req.query.status;
			var query;
			if(typeof status === "undefined")
				query={};
			else
				query={status:status};
			var data = await order.getOrderList(query);
			res.send(data);
		}catch(err){
			console.log(err);
			res.send({});
		}
	});

	app.post('/createAccount',(req,res)=>{
		console.log(req.body);
	});

	app.get('/getMenu',async(req,res)=>{
		try{
			var result = await meal.getMenu();
			res.send(result);
		}catch(err){
			res.send({});
		}
	});

	app.get('/whoAmI',(req,res)=>{
		res.send(req.session.account);
	});
	
	server.listen(8787,()=>{
		console.log('server gogo OUO!');
	});
}

init();
