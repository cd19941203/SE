var socket;

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
}

function update()
{
    $.ajax({
        url: "/getMenu",
        type: "get",
        cache: false,
        data:{},
        success: function(data)
        {
            updateData(data);
        },
    });
}

function submitOrder()
{
    var meal = [];
    var totalPrice = 0;
    var submitObject = {};
    for(var i of myOrderIndex)
    {
        var nowData = data[menu[i[0]][i[1]]];
        var num = myOrder[i[0]][i[1]];
        nowData.amount = num;
        totalPrice += num * nowData.price;
        meal.push(nowData);
    }
    submitObject.meal = meal;
    submitObject.totalPrice = totalPrice;
    socket.emit('newOrder', JSON.stringify(submitObject));
    myOrder = [];
    myOrderIndex = [];
    $('#order_list').html("");
}


addEventListener("load",init,false);