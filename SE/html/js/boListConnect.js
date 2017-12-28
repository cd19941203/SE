function init()
{
    $.ajax({
        url: "/getOrderList",
        type: "get",
        data:{
            status: "new"
        },
        success: function(data)
        {
            addData(data);
        },
    });
}

addEventListener("load",init,false);