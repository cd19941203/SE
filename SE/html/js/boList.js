
var STATUS='WAIT';

//the Switch to open Notice or not.
var onNotice = true;

//--------------------------- Function about Action ---------------------------//
function mesgNotice(title,message,tag){
    if(onNotice&&window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            var notice_ = new Notification(title, { body: "["+tag+"] "+message,tag:tag});
            notice_.onclick = function() {
				notice_.close();
            }
        });
    }
}

function btnRemoveList(test,btn_switch){
	if(btn_switch)//bind 'click' event
	{
		$(test).click( 
			function(){
				var item = $(this);
				
				mesgNotice("Test Title", test+"Click", "Button");
				$(this).parent().parent().parent().children('.information').html('TEST');
				//);
				item.parent().parent().parent().parent().fadeOut(400);
				setTimeout(function(){item.parent().parent().parent().parent().remove();},1000);
			}
		);
	}
	else //unbind 'click' event
	{
		$(test).unbind("click");
	}
}

//--------------------------- Function about Data   ---------------------------//

//EX.   addData(example);
function addData(data){
	var data = JSON.parse(data);
	for(var i = 0; i < data.length ; i++)
	{
		webMake(data[i].orderNumber,data[i].account,"0988452145","100",[[data[i].mealName,10,350],['起司蛋餅',10,350]],4);
	}
}

//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	var length = document.getElementsByClassName('btnn').length;
	for(var i=0;i<length;i++)
	{
		document.getElementsByClassName('btnn')[i].innerHTML = btnStr[STATUS];
	}
	
	if(STATUS=='NEW')
	{
		btnRemoveList(NAME['ACCEPT'], true);
	}
	else if (STATUS == 'ACCEPT')
	{
		
	}
	else if(STATUS == 'WAIT')
	{
		
	}
	else {console.error("'STATUS' is error");}
}
function btnPage(){
	$("#NEW").click(function(){
		STATUS = "NEW";addData(example);
	});
	$("#ACCEPT").click(function(){
		STATUS = "ACCEPT";addData(example);
	});
	$("#WAIT").click(function(){
		STATUS = "WAIT";addData(example);
	});
	
}
function init(){
	//All Trigger Button Action
	btnPage();
	btnTrigger();
	
	//Notification
	$("#onNotice").bootstrapSwitch({size:"mini"});
	$("#onNotice").on('switchChange.bootstrapSwitch', function(event, state) {onNotice = state;});
	
	//init
	//$("#NEW").trigger('load');
}
addEventListener("load",init,false);