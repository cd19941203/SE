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

addEventListener("load",init,false);