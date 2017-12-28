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
}
addEventListener("load",init,false);