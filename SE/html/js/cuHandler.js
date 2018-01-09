var socket;
var openTime;
var dateDom;
var url;

function init()
{
    url = new URL(window.location.href);
    m = url.searchParams.get('m');
    //socket = io.connect('localhost:8787');
	socket = io.connect('140.121.197.192:9487');
	if(m==null || m== 'cuMenu')
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
    
    socket.on('orderModify',(data)=>{
		swal("訂單請求修改", "訂單編號 #"+data["orderNumber"] + '\n' + data.advice, {timer:30000,icon:"success"});
	});
    
    socket.on('orderRes',(data)=>{
		swal("訂單修改送出", "訂單編號 #"+data["orderNumber"], {timer:30000,icon:"success"});
	});
    
    socket.on('menuStatusUpdate',(data)=>{
		swal("商品缺貨", "", {timer:30000,icon:"success"}).then((value)=>{
            update();
        });
	});
    
    if(m==null || m=='cuMenu')
    {
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
	dateDom = document.createElement("input");
	dateDom.setAttribute("required", "");
    dateDom.setAttribute('type','time');
	swal({closeOnClickOutside: false, title: "預期時間", content: dateDom, buttons: {confirm:{text:"確定", value:true},cancle:{text:"取消",value:false}}}).then((value)=>{        
        if(!value)
            return;
        var expectTime = dateDom.value;
        var now = new Date();
        var begin = openTime[now.getDay()].begin.split(':');
        var end = openTime[now.getDay()].end.split(':');
        begin[0] = parseInt(begin[0]);
        begin[1] = parseInt(begin[1]);
        end[0] = parseInt(end[0]);
        end[1] = parseInt(end[1]);
        begin = new Date(now.getFullYear(),now.getMonth(),now.getDate(),begin[0],begin[1]);
		end = new Date(now.getFullYear(),now.getMonth(),now.getDate(),end[0],end[1]);
		
		if(expectTime=="")
		{
            swal("未輸入取餐時間", '', {timer:10000,icon:"info"});
            return;
		}
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
        submitObject.expectTime = (new Date().toLocaleDateString().replace(/\//g,'-')) + ' ' + expectTime;
        if(totalPrice != 0)
        {
            var orderDom = document.createElement("div");
            
            var myStr = "";
            for(var i=0;i<myOrderIndex.length;i++){
                myStr+='<li class = "top-li">';
                myStr+=	'<span class = "order_name">'+
                        '	'+myOrderIndex[i][1]+
                        '	<span>x<B>'+ myOrder[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ] +'</B></span>'+
                        '</span>'+
                        '<span>'+
                        '	<div class = "information" id = "info_'+menu[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ]+'"hidden>'+myOrderIndex[i][0]+','+myOrderIndex[i][1]+','+myOrder[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ]+'</div>'+
                        '</span>';

                if(myOrderIndex[i][1] == "套餐"){
                    myStr+='<ul>';
                    myStr+='</ul>';
                }
                myStr+='</li>';
            }            
            
            var tmp = document.createElement("span");
            tmp.style.textAlign = "left";
            tmp.innerHTML = myStr;;
            orderDom.appendChild(tmp);
            
            tmp = document.createElement("span");
            tmp.innerHTML = "預期時間 : " + expectTime;
            orderDom.appendChild(tmp);
                        
            swal({closeOnClickOutside: false, title: "確認訂單", content: orderDom, buttons: {confirm:{text:"確定", value:true},cancle:{text:"取消",value:false}}}).then((value)=>{
                if(!value)
                    return;
                
                if(id == null)
                    socket.emit('newOrder', JSON.stringify(submitObject));
                else
                {
                    submitObject.orderNumber = parseInt(id);
                    socket.emit('orderRes', JSON.stringify(submitObject));
                }
                myOrder = [];
                myOrderIndex = [];
                $('#order_list').html("");
            });
        }
        else
        {
            addNoty('購物車不能為空', notyType.error);
        }
        
	});
    
}

addEventListener("load",init,false);