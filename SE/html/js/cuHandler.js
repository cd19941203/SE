var socket;
var openTime;

function init()
{
    socket = io.connect('localhost:8787');
    socket.on('orderCancel',(data)=>{
		swal("訂單被拒", "訂單編號 #"+data["orderNumber"], {timer:30000,icon:"warning"});
	});
    
    socket.on('orderAccept',(data)=>{
		swal("訂單成立", "訂單編號 #"+data["orderNumber"], {timer:30000,icon:"success"});
	});
    
    socket.on('orderComplete',(data)=>{
		swal("訂單完成", "訂單編號 #"+data["orderNumber"], {timer:30000,icon:"success"});
	});
    
    socket.on('newOrder',(data)=>{
		swal("訂單已送出", "", {timer:30000,icon:"success"});
	});
    update();
    
    $.ajax({
        url: "/getSetting",
        type: "get",
        cache: false,
        data:{},
        success: function(data)
        {
            openTime = data.orderTime;
        },
    });
}

function update()
{
    $.ajax({
        async:false,
		url: "/getMenu",
        type: "get",
        cache: false,
        data:{},
        success: function(a)
        {
            data = a;
            updateData(a);
        },
    });
}

async function submitOrder()
{
    await $.ajax({
        sync: false,
        url: "/getMenu",
        type: "get",
        cache: false,
        data:{},
        success: function(a)
        {
            data = a;
            updateData(a);
        },
    });
	dateDom = document.createElement("date");
	swal({title: "預期時間", content: 'input', buttons: {confirm:{text:"確定", value:true},cancle:{text:"取消",value:false}}}).then((value)=>{
		if(!value)
			return;
		var now = new Date();
		var begin = openTime[now.getDay()].begin.split(':');
		var end = openTime[now.getDay()].end.split(':');
		begin[0] = parseInt(begin[0]);
		begin[1] = parseInt(begin[1]);
		end[0] = parseInt(end[0]);
		end[1] = parseInt(end[1]);
		begin = new Date(now.getFullYear(),now.getMonth(),now.getDate(),begin[0],begin[1]);
		end = new Date(now.getFullYear(),now.getMonth(),now.getDate(),end[0],end[1]);
		if(now < begin || now > end)
		{
			swal("非點餐時間", '', {timer:10000,icon:"info"});
			return;
		}
		var meal = [];
		var totalPrice = 0;
		var submitObject = {};
		for(var i of myOrderIndex)
		{
			var nowData = data[menu[i[0]][i[1]]];
			var num = myOrder[i[0]][i[1]];
			if(!data[menu[i[0]][i[1]]].inventory)
			{
				//timelyCategoryDelete(menu[i[0]][i[1]]);
				addNoty('有商品缺貨請重新訂購', notyType.error);
				$('#clearAll').click();
				return;
			}
			else
			{
				nowData.amount = num;
				totalPrice += num * nowData.price;
				meal.push(nowData);
			}
		}
		submitObject.meal = meal;
		submitObject.totalPrice = totalPrice;
		if(totalPrice != 0)
		{
			socket.emit('newOrder', JSON.stringify(submitObject));
			myOrder = [];
			myOrderIndex = [];
			$('#order_list').html("");
		}
		else
		{
			addNoty('購物車不能為空', notyType.error);
		}
	});
    
}

addEventListener("load",init,false);