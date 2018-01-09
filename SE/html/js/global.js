//Global variable
//ICON
var ICON = Object.freeze({
	alert:"image/icon/alert.png",
	attention: "image/icon/attention.png",
	information: "image/icon/information.png",
	proihibited: "image/icon/proihibited.png"});

var notyType = Object.freeze({alert: 'alert', success: 'success', warning: 'warning', error: 'error', info: 'info'});

//Global function


//window.Notification       replace by addNoty()
/*function mesgNotice(title,message,img){
	
	if(!img)img="image/icon/Information.png";
    if(onNotice&&window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            var notice_ = new Notification(title, { body: message,icon:img});
			setTimeout(function(){notice_.close();},2000);
            notice_.onclick = function() {
				notice_.close();
            }
        });
    }
}*/


function addNoty(message, myType = notyType.info,myNotice = true)
{
	if(myNotice){
		var noty = new Noty({
			theme: 'bootstrap-v3',
			text: message,
			type: myType,
			layout: 'bottomRight',
			timeout: 4000
		}).show();
	}
}
