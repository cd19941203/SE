var orderTime;
var example = {"orderTime":[{"begin":"00:00","end":"00:00"},{"begin":"06:30","end":"23:59"},{"begin":"00:00","end":"23:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"}]};
function btnTrigger(){
	$(".boSettingBtn").unbind('click');
	$(".boSettingBtn").click(function(){
		if($(this).hasClass('btn-default')){
			$(this).removeClass('btn-default');
			$(this).addClass('btn-info');
		}
		else
		{
			$(this).addClass('btn-default');
			$(this).removeClass('btn-info');
		}
	});
}

function getSetting(isExample = false)
{
	if(!isExample)
    $.ajax({
        url: "/getSetting",
        type: "get",
        success: function(data)
        {
            orderTime = data.orderTime;
        }
    });
	else orderTime = example.orderTime;
}

function submitChangeSetting(newSetting)
{
    $.ajax({
        url: "/updateOrderTime",
        type: "post",
        contentType: "application/json",
        data: newSetting,
        success: function(data)
        {
            swal(data ,"更改營業時間成功",{icon:'success'});
        }
    });
}
function boSettinginit(){
	btnTrigger();
	getSetting(true);
	for(var i = 0 ; i < 7; i++)
	{
		if(!(orderTime[i].begin == orderTime[i].end && orderTime[i].begin =="00:00")){
			$('#week_'+i).click();
			$('#week_'+ i +'_begin').val(orderTime[i].begin);
			$('#week_'+ i +'_end'  ).val(orderTime[i].end);
			$('#week_'+ i +'_begin').removeAttr('disabled');
			$('#week_'+ i +'_end'  ).removeAttr('disabled');
		}
		else{
			//Nothing
		}
	}
}
addEventListener('load',boSettinginit,false);