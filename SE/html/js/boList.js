//The List Button
var ACCEPT = ".accept";
var EDIT = ".edit";
var REFUSE = ".refuse";

function btnRemoveList(test,btn_switch){
	if(btn_switch)//bind 'click' event
	{
		$(test).click( 
			function(){
				$(this).parent().parent().parent().parent().fadeOut(400);
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
}
addEventListener("load",init,false);