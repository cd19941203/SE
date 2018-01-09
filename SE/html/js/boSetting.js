var orderTime;

function getSetting()
{
    $.ajax({
        url: "/getSetting",
        type: "get",
        success: function(data)
        {
            orderTime = data;
        }
    });
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