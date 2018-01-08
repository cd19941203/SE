var data = [];
var table = {};
//--------------------------- Function about Action ---------------------------//

//--------------------------- Function about Data   ---------------------------//

//EX.   updateData(example);
function updateData(tmp = data){
	$("#DATA").html("");
	tmp = tmp.sort(function(a,b)
	{
		return (Date.parse(a.beginTime)).valueOf() < (Date.parse(b.beginTime)).valueOf() ? -1 : 1;
	});
	data = tmp;
	$("#DATA").html("");
	for(var i = 0 ;i < tmp.length;i++ )
	{
        table[tmp[i].orderNumber] = tmp[i];
		webMake(i);
	}
}

//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	var length = document.getElementsByClassName('myBtn').length;
	$(".btnOrder").unbind('click');
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
	$(".edit").unbind('click');
	$(".edit").click(function(){
		var myID = parseInt($(this).parent().parent().siblings('.information').html());
		
		//////    Guide webpage  'cuMenu.html'     and  get "ID"    ///////
	});
	$(".refuse").unbind('click');
	$(".refuse").click(function(){
		var myID = parseInt($(this).parent().parent().siblings('.information').html());
		
		swal("確定取消此次訂單?", {
			buttons: {
				OK: {
					text: "確定",
					value: "OK",
				},
				cancel: "Cancel"
			},
			})
		.then((value) => {
			switch (value) {
				case "OK":
					var tmpRef = $(this);
					$(this).parent().parent().parent().parent().fadeOut(400);
					setTimeout(function(){tmpRef.parent().parent().parent().parent().remove();},1000);
					//swal("通知","已取消此次訂單", {closeOnClickOutside: false,icon:"success"});
                    socket.emit('orderCancel', JSON.stringify(table[myID]));
					break;
				default:
					break;
		}});
	});
}

function cuHistory_init(){
	//All Trigger Button Action
	btnTrigger();
    socket = io.connect('localhost:8787');
    socket.on('orderCancel', (data) => {
        swal("通知", "已取消此次訂單", {closeOnClickOutside: false,icon:"success"});
        update();
    });
    
	$.ajax({
        url: "/getOrderList",
        type: "get",
        cache: false,
        data:{
        },
        success: function(data)
        {
			console.log(data);
            updateData(data);
        },
    });
	//cuHistory_init
	//updateData(example);
}
addEventListener("load",cuHistory_init,false);