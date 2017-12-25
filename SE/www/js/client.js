var socket;
function init(){
	socket = io.connect('localhost:8787');
	socket.on('res',(data)=>{
		document.getElementById("output1").innerHTML = data;
	});
}
addEventListener("load",init,false);
function test1(){
	var DIV1 = document.getElementById("output1");
	socket.emit('newOrder','{"test":8787}');
}
function test2(){
	var DIV2 = document.getElementById("output2").innerHTML = "Click";
}
function test3(){
	var DIV3 = document.getElementById("output3").innerHTML = "Click";
}