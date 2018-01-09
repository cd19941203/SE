var debugMode = false;
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
	
	$('.inputTime').change(function()
	{
		if(debugMode)console.log($(this).attr('id') + ' is click');
		if(debugMode)console.log($(this).val());
		
		if($(this).val()!="")
		{
			var myId = $(this).attr('id').substr(5,1);
			console.log('Start' + myId);
			console.log($('#week_'+myId+'_begin').val());
			console.log($('#week_'+myId+'_end').val());
			if($('#week_'+myId+'_begin').val() < $('#week_'+myId+'_end').val())
			{
				$(this).parent().siblings('.inputBtn').children('.btn-success').removeAttr('disabled');
			}
			else
			{
				$(this).parent().siblings('.inputBtn').children('.btn-success').attr('disabled',true);
			}
		}
		else
		{
			$(this).parent().siblings('.inputBtn').children('.btn-success').attr('disabled',true);
		}
	});
	$('.changeBtn').click(function(){
		var myId = $(this).attr('id').substr(7);
		console.log(myId);
		orderTime[myId].begin = $('#week_'+myId+'_begin').val();
		orderTime[myId].end = $('#week_'+myId+'_end').val();
		submitChangeSetting(orderTime);
		$(this).attr('disabled',true);
	});
	$('.default_time').click(function(){
		var myId = $(this).attr('id').substr(8);
		console.log(myId);
		$('#week_'+myId+'_begin').val(orderTime[myId].begin);
		$('#week_'+myId+'_end').val(orderTime[myId].end);
		$('#change_'+myId).attr('disabled',true);
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