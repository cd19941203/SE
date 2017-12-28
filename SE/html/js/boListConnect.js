function init()
{
    $.ajax({
        url: "/getOrderList",
        type: "get",
        data:{},
        success: function(data)
        {
            addData(data);
        },
    });
}

addEventListener("load",init,false);