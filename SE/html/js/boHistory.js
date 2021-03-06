var data = [];
var STATUS='NEW';
var sortStatus = "Time";
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

//EX.   updateData(example);
function updateData(tmp = data){
	//console.log(data);
	clearData();
	tmp = tmp.sort(function(a,b)
	{
		return a.orderNumber > b.orderNumber ? -1 : 1;
	});
	/*var tmp = JSON.parse(tmp);
	for(var i = 0; i < tmp.length ; i++)
	{
		data[ tmp[i].orderNumber ] = tmp[i];
		webMake(tmp[i].orderNumber,tmp[i].account,"0988452145","100",[[tmp[i].mealName,10,350],['起司蛋餅',10,350]],4);
	}*/
    
	for(var key in tmp)
	{
		var mealTemp = [];
        for(var meal of tmp[key].meal)
            mealTemp.push([meal.name,meal.amount,meal.price*meal.amount]);
		webMake(tmp[key].orderNumber,tmp[key].account,"0988452145",tmp[key].beginTime,tmp[key].totalPrice,mealTemp,4,tmp[key].status);
	}
	data = tmp;
    userInfo();
}
function clearData(){
	$("#DATA").html("");
}

//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	var length = document.getElementsByClassName('myBtn').length;
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
}
function btnPage(){
	$("#NEW").click(function(){
		$("#NEW").addClass("list-group-item-info");
		$("#ACCEPT").removeClass("list-group-item-info");
		$("#WAIT").removeClass("list-group-item-info");
		$("#title").html("等待中 &nbsp; ");
		STATUS = "NEW";
		//updateData(example);
		
		document.getElementById("allaccept").style.display = "inline";
	});
	$("#ACCEPT").click(function(){
		$("#NEW").removeClass("list-group-item-info");
		$("#ACCEPT").addClass("list-group-item-info");
		$("#WAIT").removeClass("list-group-item-info");
		$("#title").html("處理中");
		STATUS = "ACCEPT";
        //updateData(example);
		document.getElementById("allaccept").style.display = "none";
	});
	$("#WAIT").click(function(){
		$("#NEW").removeClass("list-group-item-info");
		$("#ACCEPT").removeClass("list-group-item-info");
		$("#WAIT").addClass("list-group-item-info");
		$("#title").html("待取餐");
		STATUS = "WAIT";
        //updateData(example);
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
					//console.log("YES");
					break;
				default:
					break;
			};
		});
	})
	$("#btnSort").mouseup(function(){
		setTimeout(function(){
		sortStatus = $('input[name="options"]:checked').val();
		updateData();
		},10);
	});
	/*window.setInterval(function(){
		console.log( $('input[name="options"]:checked').val() );
	}, 100); */
	/*$(".bb").click(function(){
		// 下面这行代码就是你要的ID属性
		console.log($(this).attr("id"));
	});*/
	btnPage();
	btnTrigger();
	
	///example is a variable       use test
	/*example = JSON.parse(example);
	data = example;*/
    $.ajax({
        url: "/getOrderList",
        type: "get",
        cache: false,
        data:{
            //status:"done"
        },
        success: function(data)
        {
			for(var doc of data)
				doc.beginTime = doc.beginTime.replace('Z','');
            updateData(data);
        },
    });
	//updateData(example);
	//Notification
	$("#onNotice").bootstrapSwitch({size:"mini"});
	$("#onNotice").on('switchChange.bootstrapSwitch', function(event, state) {onNotice = state;});
	document.getElementById("beginTime").value = (new Date()).getFullYear()+'-01-01';
	document.getElementById("endTime").value = (new Date()).getFullYear()+'-12-31';
	//boList_init
}

function query()
{
    var begin = document.getElementById("beginTime").value;
    var end = document.getElementById("endTime").value;
    if(begin == "" || end == "" || end < begin)
    {
        swal('錯誤','時間格式錯誤',{icon:'error'});
        return;
    }
        
    $.ajax({
        url: "/getOrderList",
        type: "get",
        cache: false,
        data:{
            beginTime: begin,
            endTime: end
        },
        success: function(data)
        {
            updateData(data);
        }
    });
}
addEventListener("load",boList_init,false);