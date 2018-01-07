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
            var newAmount = 0, acceptAmount = 0, waitAmount = 0;
            
            for(doc of data)
            {
                if(doc.status == 'new')
                    newAmount++;
                else if(doc.status == 'accepted')
                    acceptAmount++;
                else if(doc.status == 'completed')
                    waitAmount++;
            }
            statusNumber.NEW = newAmount;
            statusNumber.ACCEPT = acceptAmount;
            statusNumber.WAIT = waitAmount;
            updateStatusNumber(0,0,0);
        },
    });
}

function init()
{
    update();
}
addEventListener("load",init,false);