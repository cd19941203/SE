function update()
{
    $.ajax({
        url: "/getOrderList",
        type: "get",
        cache: false,
        data:{},
        success: function(data)
        {
            updateData(data);
        },
    });
}

function init()
{
    update();
}
addEventListener("load",init,false);