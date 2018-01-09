var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var app = express();
var server = Server(app);
var sio = require("socket.io")(server);
var bodyParser = require('body-parser');
var formData = require("express-form-data");
var fs = require('fs');
//var multer  = require('multer');
//var upload = multer({ dest: '../user_image/'});

var socket = require('./order.js');
var account = require('./account.js');
var database = require('./database.js');
var meal = require('./meal.js');
var setting = require('./setting.js');
var order = require('./order.js');
var analyze = require('./analyze.js');

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

function datePlus8(x){
	x.setHours(x.getHours()+8);
	return x;
}

function init(){
	
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
	app.use('/userImage',express.static(__dirname + '/../userImage'));
	app.use('/mealImage',express.static(__dirname + '/../mealImage'))
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
	///^(?:(?!index).)*$/
	
	var needLoginPath = ['/getOrderList','/getMenu','/whoAmI','/updateMenu','/getMenu','/getSetting','/updateSetting',
						'/setMealImage','/getUserInfo','/updateAccountInfo','/updateOrderTime','/soldOut','/mealAnalyze',
						'/genderAnalyze','/orderBan'];

	var bossOnly = ['/updateMenu','/updateSetting','/updateOrderTime','/soldOut','/mealAnalyze','/genderAnalyze',
				   '/orderBan'];

	app.use(needLoginPath,(req,res,next)=>{
		if(req.session.valid == 'notValid'){
			res.sendFile('emailConfirm.html',{root:rootPath});
		}
		else if(!(req.session.valid==true)){
			res.sendFile('login.html',{root:rootPath});
        }else
			next();
	});
	
	app.use(bossOnly,(req,res,next)=>{
		if(req.session.account != 'boss')
			res.sendStatus(404);
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
		if(user != 'boss'){
			socket.join('customer');
		}

		// 把各個user加入個別的room,即可一次對該user的所有socket emit
		// unfortunately socket.join is asynchronous... 
		socket.join(socket.request.session.account,()=>{
			
			// from customer
			socket.on('newOrder',async(data)=>{
				try{
					if(await setting.checkCanOrder() == false){
						sio.to(socket.request.session.account).emit('newOrder','cant order now');
					}
					else{
						var newOrder = JSON.parse(data);
						newOrder['account'] = socket.request.session.account;
						newOrder['orderNumber'] = await setting.getOrderNumber();
						newOrder['status'] = 'new';
						newOrder['beginTime'] = getDate();
						newOrder['expectTime']  = datePlus8(new Date(newOrder['expectTime']));
						await order.newOrder(newOrder);
						newOrder['userInfo'] = account.getUserInfo(socket.request.session.account);
						delete newOrder['_id'];
						delete newOrder['userInfo']['_id'];
						delete newOrder['userInfo']['password'];
						// ack customer
						sio.to(socket.request.session.account).emit('newOrder',{orderNumber:newOrder['orderNumber'],status:'success'});
						// to boss
						sio.to('boss').emit('newOrder',newOrder);
					}
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
				if(socket.request.session.account != 'boss')
					return ;
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
				if(socket.request.session.account != 'boss')
					return ;
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
				if(socket.request.session.account != 'boss')
					return ;
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
				if(socket.request.session.account != 'boss')
					return ;
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
						sio.to(account).emit('orderModify',{orderNumber:orderNumber,meal:values[0]['meal'],advice:advice});
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
					orderRes['beginTime'] = getDate();
					orderRes['expectTime']  = datePlus8(new Date(newOrder['expectTime']));
					await order.updateOrder(orderNumber,{status:'new',meal:orderRes['meal'],totalPrice:orderRes['totalPrice'],expectTime:orderRes['expectTime'],beginTime:orderRes['beginTime']});
					orderRes['userInfo'] = account.getUserInfo(socket.request.session.account);
					delete orderRes['userInfo']['_id'];
					delete orderRes['userInfo']['password'];
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
						delete orderData['userInfo']['_id'];
						delete orderData['userInfo']['password'];
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

	app.get('/',async(req,res)=>{
		/*
		try{
			var data = await setting.getSetting();
			var now = new Date();
			var day = now.getDay();
			var min = now.getMinutes();
			var hr = now.getHours();
			var nowStr = hr + ':' + min;
			var orderTime = data['orderTime'][day];
			console.log(nowStr);
			console.log(orderTime['begin']);
			console.log(orderTime['end']);
			if(nowStr < orderTime['begin'] || nowStr > orderTime['end'])
				console.log('!');
			else
				console.log('~');        
		}catch(err){
			console.log(err);
		}*/
		/*
		var data = await analyze.getGenderAccount('男');
		console.log(data);
		var dd = await analyze.calculateByAccount(data,datePlus8(new Date('2017-12-01')),datePlus8(new Date('2018-02-01')));
		console.log(dd);
		//await account.sendMail('eden851104@gmail.com');
		res.location('/index?m=cuSetting');
		*/
		res.redirect('/index');
	});

	app.post('/emailConfirm',async(req,res)=>{
		var acc = req.session.account;
		var code = req.body.code;
		try{
			var re = await account.emailConfirm(acc,code);
			if(re){
				req.session.valid = true;
				res.redirect('/index');
			}else{
				res.send('err');
			}
		}catch(err){
			console.log(err);
			res.sendStatus(404);
		}
	});

	app.get('/getNewCode',async(req,res)=>{
		var acc = req.session.account;
		try{
            console.log(acc);
			await account.getNewVerificationCodes(acc);
			res.send('success');
		}catch(err){
			res.send('err');
		}
	});

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
			else if(status == 'notValid'){
				req.session.valid = 'notValid';
				req.session.account = acc;
				res.sendFile('emailConfirm.html',{root:rootPath});
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
		if(req.session.valid == 'notValid')
			res.sendFile('emailConfirm.html',{root:rootPath});
        else if(req.session.valid != true){
            res.sendFile('login.html',{root:rootPath});
        }
		else if(typeof m === "undefined"){
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



	// API

	app.get('/getOrderList',async(req,res)=>{
		try{
			var status = req.query.status;
			var query;
			var beginTime = req.query.beginTime;
			var endTime = req.query.endTime;
			var orderNumber = req.query.orderNumber;
			if(typeof beginTime !== 'undefined' && typeof endTime !== 'endefined'){
				beginTime = datePlus8(new Date(beginTime));
				endTime = datePlus8(new Date(endTime));
				query = {$and:[{beginTime:{$lte:endTime}},{beginTime:{$gte:beginTime}}]};
			}
            else{
                query = {};
            }
			if(typeof orderNumber !== "undefined")
				query['orderNumber'] = parseInt(orderNumber);
			if(typeof status === "undefined")
				;
			else
				query={status:status};
			if(req.session.account != 'boss'){
				query['account'] = req.session.account;
			}
			var data = await order.getOrderList(query);
			res.send(data);
		}catch(err){
			console.log(err);
			res.send({});
		}
	});

	app.post('/createAccount',async(req,res)=>{
		try{
			if(typeof req.body.account === 'undefined' || typeof req.body.password === 'undefined')
				throw('data format err');
			await account.createAccount(req.body,req.files.image);
			res.send('success');
		}catch(err){
			res.send(err);
		}
	});

	app.post('/updateAccountInfo',async(req,res)=>{
		try{
			if(typeof req.body.password === 'undefined')
				throw('data format err');
			await account.updateAccountInfo(req.session.account,req.body,req.files.image);
			res.send('success');
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

	app.post('/updateMenu',async(req,res)=>{
		try{
			var menu = JSON.parse(req.body.data);
			if(typeof menu === 'undefined')
				throw('no data');
			await meal.updateMenu(menu);
			res.send('success');
		}catch(err){
			res.send(err);
		}
	});

	app.post('/setMealImage',async(req,res)=>{
		try{
			if(typeof req.body.name === 'undefined' || typeof req.files.image === 'undefined')
				throw('no data');
			await setMealImage(req.body.name,req.files.image);
			res.send('success');
		}catch(err){
			res.send(err);
		}
	});

	app.get('/getSetting',async(req,res)=>{
		try{
			var settingData = await setting.getSetting();
			res.send(settingData);
		}catch(err){
			res.send(err);
		}
	});

	app.post('/updateOrderTime',async(req,res)=>{
		try{
			var newTime = req.body;
			await setting.updateOrderTime(newTime);
			res.send('success');
		}catch(err){
			res.send(err);
		}
	});

	app.post('/updateSetting',(req,res)=>{

	});

	app.get('/getUserInfo',async(req,res)=>{
		try{
			var acc = req.session.account;
			if(req.session.account == 'boss'){
				if(typeof req.query.account !== 'undefined')
					acc = req.query.account;
			}
			var data = await account.getUserInfo(acc);
			delete data['_id'];
			if(req.session.account == 'boss')
				delete data['password'];
			res.send(data);
		}catch(err){
			res.send(err);
		}
	});

	app.get('/whoAmI',(req,res)=>{
		res.send(req.session.account);
	});
	
	app.post('/soldOut',async(req,res)=>{
		try{
			var soldOutMeal = req.body;
			for(var m of soldOutMeal){
				await meal.setMealStatus(m,false);
			}
			var dbNoMeal = await meal.getSoldOut();
			for(var m of dbNoMeal){
				if(soldOutMeal.indexOf(m.name) == -1){
					await meal.setMealStatus(m.name,true);
				}
			}
			sio.to('customer').emit('menuStatusUpdate','yoyo');
			res.send('success');
		}catch(err){
			res.send(err);
		}
	});

	app.get('/mealAnalyze',async(req,res)=>{
		try{
			var beginTime = datePlus8(new Date(req.query.beginTime));
			var endTime = datePlus8(new Date(req.query.endTime));
			var data = await analyze.mealAnalyze(beginTime,endTime);
			res.send(data);
		}catch(err){
			res.send(err);
		}
	});

	app.get('/genderAnalyze',async(req,res)=>{
		try{
			var beginTime = datePlus8(new Date(req.query.beginTime));
			var endTime = datePlus8(new Date(req.query.endTime));
			var data = await analyze.genderAnalyze(beginTime,endTime);
			res.send(data);
		}catch(err){
			res.send(err);
		}
	});

	app.post('/orderBan',async(req,res)=>{
		try{
			var orderNumber = req.body.orderNumber;
			if(typeof orderNumber === 'undefined')
				res.send('err');
			await order.orderStatusChange(orderNumner,'notComplete');
		}catch(err){
			res.send(err);
		}
	});

	server.listen(8787,()=>{
		console.log('server start!');
	});
}

init();
