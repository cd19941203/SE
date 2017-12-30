var data = [];
var STATUS='NEW';

//the Switch to open Notice or not.
var onNotice = true;

//--------------------------- Function about Action ---------------------------//
function mesgNotice(title,message,img){
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
}

function btnRemoveList(item, title = "Title", message = "", icon){
	var id = $(item).parent().parent().parent().children('.information').html();
	mesgNotice(title, "#" + id +" "+ message,icon);
	
	item.parent().parent().parent().parent().fadeOut(400);
	setTimeout(function(){item.parent().parent().parent().parent().remove();},1000);
}

//--------------------------- Function about Data   ---------------------------//

//EX.   addData(example);
function addData(tmp){
	clearData();
	//var tmp = JSON.parse(tmp);
	for(var i = 0; i < tmp.length ; i++)
	{
		data[ tmp[i].orderNumber ] = tmp[i];
		webMake(tmp[i].orderNumber,tmp[i].account,"0988452145","100",[[tmp[i].mealName,10,350],['起司蛋餅',10,350]],4);
	}
}
function clearData(){
	$("#DATA").html("");
}

//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	var length = document.getElementsByClassName('myBtn').length;
	for(var i=0;i<length;i++){
		document.getElementsByClassName('myBtn')[i].innerHTML = btnStr[STATUS];
	}
	$(".btnOrder").click(function(){
		$(this).parent().parent().children(".myOrder").slideToggle("fast");
		if( $(this).hasClass("fa-angle-down") ){
			$(this).removeClass("fa-angle-down");
			$(this).addClass("fa-angle-up");
		}
		else{
			$(this).addClass("fa-angle-down");
			$(this).removeClass("fa-angle-up");
		}
	});
	if(STATUS=='NEW'){
		$(".accept").click(function(){
			btnRemoveList($(this),"accept");
		});
		$(".refuse").click(function(){
			btnRemoveList($(this),"refuse");
		});
		$(".edit").click(function(){
			
			swal("Why edit this order?", {
				buttons: {
					delay: {
						text: "延期",
						value: "time",
					},
					ofs: {
						text: "缺貨",
						value: "ofs",
					},
					cancel: "Cancel"
				},
				})
			.then((value) => {
				switch (value) {
					case "time":
						swal("When?", {
							closeOnClickOutside: false,
							buttons: {
								time10: {
									text: "10 Min",
									value: "time10",
								},
								time20: {
									text: "20 Min",
									value: "time20",
								},
								time30: {
									text: "30 Min",
									value: "time30",
								},
								cancel: "Cancel"
							},
							})
						.then((value) => {
							switch (value) {
							case "time10":
							case "time20":
							case "time30":
								swal("Edit","延期請求已送出", {timer:1200,icon:"success"});
								btnRemoveList($(this),"Edit","延遲"+value.substr(4)+"分鐘",ICON['alert']);
								break;
							default:
								break;
						}});
						
						break;
					case "ofs":
						//swal({
						//	content: "input",
						//});
						swal("Edit", "缺貨請求已送出", {timer:1200,icon:"success"});
						break;
					default:
						break;
			}});
		});
	}
	else if (STATUS == 'ACCEPT'){
		$(".ok").click(function(){
			btnRemoveList($(this),"ok");
		});
	}
	else if(STATUS == 'WAIT'){
		$(".ok").click(function(){
			btnRemoveList($(this),"ok");
		});
	}
	else {console.error("'STATUS' is error");}
}
function btnPage(){
	$("#NEW").click(function(){
		$("#NEW").addClass("list-group-item-info");
		$("#ACCEPT").removeClass("list-group-item-info");
		$("#WAIT").removeClass("list-group-item-info");
		$("#title").html("等待的訂單 &nbsp; ");
		STATUS = "NEW";
		//addData(example);
		
		document.getElementById("allaccept").style.display = "inline";
	});
	$("#ACCEPT").click(function(){
		$("#NEW").removeClass("list-group-item-info");
		$("#ACCEPT").addClass("list-group-item-info");
		$("#WAIT").removeClass("list-group-item-info");
		$("#title").html("處理中");
		STATUS = "ACCEPT";
        //addData(example);
		document.getElementById("allaccept").style.display = "none";
	});
	$("#WAIT").click(function(){
		$("#NEW").removeClass("list-group-item-info");
		$("#ACCEPT").removeClass("list-group-item-info");
		$("#WAIT").addClass("list-group-item-info");
		$("#title").html("待取餐");
		STATUS = "WAIT";
        //addData(example);
		document.getElementById("allaccept").style.display = "none";
	});
	
}
function boList_init(){
	//All Trigger Button Action
	$("#allaccept").click(function(){
		swal("確定接收所有的訂單？", {
			buttons: {
				ok: {
					text: "確定",
					value: "ok",
				},
				cancel: "Cancel"
			},
			})
		.then((value) => {
			switch(value){
				case "ok":
					$(".accept").click();
					console.log("YES");
					break;
				default:
					break;
			};
		});
	})
	btnPage();
	btnTrigger();
	
	//Notification
	$("#onNotice").bootstrapSwitch({size:"mini"});
	$("#onNotice").on('switchChange.bootstrapSwitch', function(event, state) {onNotice = state;});
	
	//boList_init
}
addEventListener("load",boList_init,false);