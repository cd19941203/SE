var onEdit = false;

function init(){
	$("#edit").click(function(){
		if(onEdit)
		{
			$(this).removeClass("btn-warning");
			$(this).addClass("btn-success");
			$(this).html("編輯");
		}
		else
		{
			$(this).removeClass("btn-success");
			$(this).addClass("btn-warning");
			$(this).html("完成");
		}
		onEdit = !onEdit;
	});
	$(".list-group-item").click(function(){
		if( $(this).hasClass("list-group-item-danger") )
		{
			$(this).removeClass("list-group-item-danger");
			$(this).removeClass("del");
		}
		else
		{
			$(this).addClass("list-group-item-danger");
			$(this).addClass("del");
		}
		//$(".list-group-item-danger").each(function(){ console.log($(this).attr("id")) });
	});
}
addEventListener("load",init,false);