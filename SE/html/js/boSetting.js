var orderTime;
var example = [{"orderTime":[{"begin":"06:30","end":"18:00"},{"begin":"06:30","end":"23:59"},{"begin":"00:00","end":"23:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"},{"begin":"06:30","end":"12:00"}]}];
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
function boSettinginit(){
	
}
addEventListener('load',boSettinginit,false);