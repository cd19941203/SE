var socket;

function init(){
	//socket = io.connect('localhost:8787');
	socket = io.connect('140.121.197.192:9487');
	socket.on('orderAck',(data)=>{
		document.getElementById("output2").innerHTML = JSON.stringify(data);
	});
	socket.on('orderComplete',(data)=>{
		document.getElementById("output3").innerHTML = JSON.stringify(data);
	});
}

function test1(){
	var DIV1 = document.getElementById("output1");
	socket.emit('newOrder','{"mealName":[{"蛋餅":1}]}');
}
addEventListener("load",init,false);