//The List Button
var ACCEPT = ".accept";
var EDIT = ".edit";
var REFUSE = ".refuse";
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
	btnRemoveList(REFUSE, true);
	$("#onNotice").bootstrapSwitch({size:"mini"});
	
	$("#onNotice").on('switchChange.bootstrapSwitch', function(event, state) {
		//console.log(this); // DOM element
		//console.log(event); // jQuery event
		//console.log(state); // true | false
		onNotice = state;
	});
}
addEventListener("load",init,false);