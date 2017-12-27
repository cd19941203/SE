var data = '[{"account":"test","beginTime":null,"endTime":null,"mealName":["a","b","c"],"setmealName":["d","e","f"],"status":"new"},{"mealName":"蛋餅","account":"87","orderNumber":34,"status":"new"},{"mealName":{"蛋餅":1},"account":"87","orderNumber":42,"status":"new","beginTime":"2017-12-25T13:45:02.074Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":43,"status":"new","beginTime":"2017-12-25T14:37:37.632Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":46,"status":"new","beginTime":"2017-12-27T07:23:36.695Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":47,"status":"new","beginTime":"2017-12-27T07:23:56.084Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":48,"status":"new","beginTime":"2017-12-27T07:24:58.431Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":49,"status":"new","beginTime":"2017-12-27T07:25:43.102Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":50,"status":"new","beginTime":"2017-12-27T07:26:05.574Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":53,"status":"new","beginTime":"2017-12-27T07:53:38.664Z"},{"mealName":[{"蛋餅":1}],"account":"client","orderNumber":59,"status":"new","beginTime":"2017-12-27T09:19:26.199Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":61,"status":"new","beginTime":"2017-12-27T17:44:47.682Z"}]';


//The List Button
var WAIT = [];
WAIT['ACCEPT'] = ".accept";
WAIT['EDIT'] = ".edit";
WAIT['REFUSE'] = ".refuse";
/*
var PROCESS = [];
PROCESS['ACCEPT'] = ".accept";
PROCESS['EDIT'] = ".edit";
PROCESS['REFUSE'] = ".refuse";
*/
var FINISH = [];
FINISH['OK'] = ".ok";
FINISH['CANCEL'] = ".cancel";


//the Switch to open Notice or not.
var onNotice = true;


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
function init(){
	btnRemoveList(WAIT['ACCEPT'], true);
	$("#onNotice").bootstrapSwitch({size:"mini"});
	
	$("#onNotice").on('switchChange.bootstrapSwitch', function(event, state) {
		//console.log(this); // DOM element
		//console.log(event); // jQuery event
		//console.log(state); // true | false
		onNotice = state;
	});
	data = JSON.parse(data);
}
addEventListener("load",init,false);