function getSetting(isExample = false)
{
	if(!isExample)
		$.ajax({
			url: "/getSetting",
			type: "get",
			success: function(data)
			{
				var orderTime = data.orderTime;
				for(var i = 0 ; i < 7;i++)
				{ 
					if(orderTime[i].begin == orderTime[i].end)
						$('#'+i).html('closed');
					else
						$('#'+i).html(orderTime[i].begin + "~" + orderTime[i].end);
				}
			}
		});
	else orderTime = example.orderTime;
}

function init(){
	getSetting();
}
addEventListener('load',init,false);