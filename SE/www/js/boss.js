var socket;
var x;

function init(){
	//socket = io.connect('140.121.197.192:9487');
	socket = io.connect('140.121.197.192:9487');
	socket.on('newOrder',(data)=>{
		x=data;
		document.getElementById("output1").innerHTML = JSON.stringify(data);
	});
	socket.on('orderAccept',(data)=>{
		document.getElementById("output2").innerHTML = JSON.stringify(data);
	});
}

function test2(){
	x['status'] = 'accept';
	socket.emit('orderAccept',JSON.stringify(x));
}
function test3(){
	x['status'] = 'waiting';
	socket.emit('orderComplete',JSON.stringify(x));
}
function test4(){
	x['status'] = 'done';
	socket.emit('orderEnd',JSON.stringify(x));
}

addEventListener("load",init,false);