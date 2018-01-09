var orderTime;
function getSetting(isExample = false)
{
	if(!isExample)
    $.ajax({
        url: "/getSetting",
		type: "get",
		async:false,
        success: function(data)
        {
            orderTime = data.orderTime;
        }
    });
	else orderTime = example.orderTime;
}

function init(){
	getSetting();
	for(var i = 0 ; i < 7;i++)
	{
		$('#'+i).html(orderTime.begin + "~" + orderTime.end);
	}
}
addEventListener('load',init,false);