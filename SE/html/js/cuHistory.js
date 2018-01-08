var data = [];

//--------------------------- Function about Action ---------------------------//
function addNoty(message, myType = notyType.info)
{
	var noty = new Noty({
		theme: 'bootstrap-v3',
		text: message,
		type: myType,
		layout: 'bottomRight',
		timeout: 4000
	}).show();
}

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
		webMake(i);
	}
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

function cuHistory_init(){
	//All Trigger Button Action
	btnTrigger();

	
	//cuHistory_init
	updateData(example);
}
addEventListener("load",cuHistory_init,false);