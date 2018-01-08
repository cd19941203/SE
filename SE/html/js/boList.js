var data = [];
var table = {};
var STATUS = 'NEW';
var sortStatus = "Time";
//the Switch to open Notice or not.
var onNotice = true;
var eventAllAccept = false;
var socket;
var mealTable = {};
var selectDom;
//--------------------------- Function about Action ---------------------------//

//window.Notification       replace by addNoty()
/*function mesgNotice(title,message,img){
	
	if(!img)img="image/icon/Information.png";
    if(onNotice&&window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            var notice_ = new Notification(title, { body: message,icon:img});
			setTimeout(function(){notice_.close();},2000);
            notice_.onclick = function() {
				notice_.close();
            }
        });
    }
}*/

function addNoty(message, myType = notyType.info) {
    if (onNotice) {
        var noty = new Noty({
            theme: 'bootstrap-v3',
            text: message,
            type: myType,
            layout: 'bottomRight',
            timeout: 4000
        }).show();
    }
}

function updateStatusNumber(New = 0, Accept = 0, Wait = 0) {
    statusNumber.NEW += New;
    statusNumber.ACCEPT += Accept;
    statusNumber.WAIT += Wait;
    $("#newNumber").html(statusNumber.NEW);
    $("#acceptNumber").html(statusNumber.ACCEPT);
    $("#waitNumber").html(statusNumber.WAIT);
}
//function btnRemoveList(item, title = "Title", message = "", icon){
function btnRemoveList(item, message, myType = notyType.info, runNoty = true) {
    var id = $(item).parent().parent().parent().children('.information').html();
    //mesgNotice(title, "#" + id +" "+ message,icon);
    if (runNoty) addNoty("#" + id + " " + message, myType);
    item.parent().parent().parent().parent().fadeOut(400);
    setTimeout(function () {
        item.parent().parent().parent().parent().remove();
    }, 1000);
}

//--------------------------- Function about Data   ---------------------------//

//EX.   updateData(example);
function updateData(tmp = data) {
    clearData();
    tmp = tmp.sort(function (a, b) {
        if (sortStatus == "Time") return (Date.parse(a.beginTime)).valueOf() < (Date.parse(b.beginTime)).valueOf() ? 1 : -1;
        else if (sortStatus == "ID") return a.orderNumber > b.orderNumber ? 1 : -1;
    });
    for (var key in tmp) {
        table[tmp[key]["orderNumber"].toString()] = tmp[key];
        var mealTemp = [];
        for (var meal of tmp[key].meal)
            mealTemp.push([meal.name, meal.amount, meal.price * meal.amount]);
        if (tmp[key]["status"].includes(STATUS.toLocaleLowerCase()) || (STATUS == "WAIT" && tmp[key]["status"] == "completed")) {
            webMake(new Order(tmp[key].orderNumber, tmp[key].account, "0988452145", tmp[key].beginTime, tmp[key].totalPrice, mealTemp));
        }
    }
    data = tmp;
}

function clearData() {
    $("#DATA").html("");
    table = {};
}

//--------------------------- Function about Trigger---------------------------//
function btnTrigger() {
    var length = document.getElementsByClassName('myBtn').length;
    for (var i = 0; i < length; i++) {
        var element = document.getElementsByClassName('myBtn')[i];
        element.innerHTML = btnStr[STATUS];
        element.setAttribute("value", element.parentElement.parentElement.firstElementChild.textContent);
    }
    $(".btnOrder").click(function () {
        $(this).parent().parent().children(".myOrder").slideToggle("fast");
        if ($(this).hasClass("fa-angle-down")) {
            $(this).removeClass("fa-angle-down");
            $(this).addClass("fa-angle-up");
        } else {
            $(this).addClass("fa-angle-down");
            $(this).removeClass("fa-angle-up");
        }
    });
    if (STATUS == 'NEW') {
        //add NEW data
        updateStatusNumber();


        $(".accept").click(function () {
            socket.emit('orderAccept', JSON.stringify(table[this.parentElement.attributes.value.value]));
            btnRemoveList($(this), "接受", notyType.success, !eventAllAccept);
            updateStatusNumber(-1, 1, 0);
            updateStatusNumber();
            update();
        });
        $(".refuse").click(function () {
            socket.emit('orderCancel', JSON.stringify(table[this.parentElement.attributes.value.value]));
            btnRemoveList($(this), "拒絕", notyType.error);
            updateStatusNumber(-1);
            updateStatusNumber();
        });
        $(".edit").click(function () {

            swal("Why edit this order?", {
                    buttons: {
                        delay: {
                            text: "延期",
                            value: "time",
                        },
                        ofs: {
                            text: "缺貨",
                            value: "ofs",
                        },
                        cancel: "Cancel"
                    },
                })
                .then((value) => {
                    switch (value) {
                        case "time":
                            swal("When?", {
                                    closeOnClickOutside: false,
                                    buttons: {
                                        time10: {
                                            text: "10 Min",
                                            value: "time10",
                                        },
                                        time20: {
                                            text: "20 Min",
                                            value: "time20",
                                        },
                                        time30: {
                                            text: "30 Min",
                                            value: "time30",
                                        },
                                        cancel: "Cancel"
                                    },
                                })
                                .then((value) => {
                                    switch (value) {
                                        case "time10":
                                        case "time20":
                                        case "time30":
                                            swal("Edit", "延期請求已送出", {timer: 1200, icon: "success"});
                                            btnRemoveList($(this), "延遲" + value.substr(4) + "分鐘", notyType.warning);
                                            updateStatusNumber(-1);
                                            break;
                                        default:
                                            break;
                                    }
                                });

                            break;
                        case "ofs":
                            /*swal("Edit", "缺貨請求已送出", {
                                timer: 1200,
                                icon: "success"
                            });*/
                            swal({
                                title: "請選擇缺貨種類",
                                content: selectDom,
                            }).then((value) => {
                                var selected = [];
                                var str = '';
                                var c = 0;
                                for(var option of selectDom.options)
                                {
                                    if(option.selected)
                                    {
                                        selected.push(option.value);
                                        if(c)
                                            str += value;
                                        else
                                            str+='、'+value;
                                    }
                                    c++;
                                }
                                var orderData = table[this.parentElement.attributes.value.value];
                                orderData['advice'] = str+' 缺貨';
                                socket.emit('orderModify', JSON.stringify(orderData));
                            });
                            //btnRemoveList($(this), "缺貨請求已送出", notyType.warning);
                            //updateStatusNumber(-1);
                            break;
                        default:
                            break;
                    }
                });
        });
    } else if (STATUS == 'ACCEPT') {
        $(".ok").click(function () {
            socket.emit('orderComplete', JSON.stringify(table[this.parentElement.attributes.value.value]));
            btnRemoveList($(this), "ok", notyType.success);
            updateStatusNumber(0, -1, 1);
            update();
        });
    } else if (STATUS == 'WAIT') {
        $(".ok").click(function () {
            socket.emit('orderDone', JSON.stringify(table[this.parentElement.attributes.value.value]));
            btnRemoveList($(this), "ok", notyType.success);
            updateStatusNumber(0, 0, -1);
            update();
        });
        $(".cancel").click(function () {
            btnRemoveList($(this), "cancel", notyType.success);
            updateStatusNumber(0, 0, -1);
        });
    } else {
        console.error("'STATUS' is error");
    }
}

function btnPage() {
    $("#NEW").click(function () {
        $("#NEW").addClass("list-group-item-info");
        $("#ACCEPT").removeClass("list-group-item-info");
        $("#WAIT").removeClass("list-group-item-info");
        $("#title").html("等待中 &nbsp; ");
        STATUS = "NEW";
        update();
        //updateData(example);

        document.getElementById("allaccept").style.display = "inline";
    });
    $("#ACCEPT").click(function () {
        $("#NEW").removeClass("list-group-item-info");
        $("#ACCEPT").addClass("list-group-item-info");
        $("#WAIT").removeClass("list-group-item-info");
        $("#title").html("處理中");
        STATUS = "ACCEPT";
        update();
        //updateData(example);
        document.getElementById("allaccept").style.display = "none";
    });
    $("#WAIT").click(function () {
        $("#NEW").removeClass("list-group-item-info");
        $("#ACCEPT").removeClass("list-group-item-info");
        $("#WAIT").addClass("list-group-item-info");
        $("#title").html("待取餐");
        STATUS = "WAIT";
        update();
        //updateData(example);
        document.getElementById("allaccept").style.display = "none";
    });

}

function boList_init() {
    //socket = io.connect('140.121.197.192:9487');
    socket = io.connect('localhost:8787');

    socket.on('newOrder', (data) => {
        swal("有新訂單!!", "訂單編號 #" + data["orderNumber"], {timer: 10000, icon: "info"});
        update();
    });

    socket.on('orderAccept', (data) => {
        swal("訂單已確認!!", "訂單編號 #" + data["orderNumber"], {timer: 10000, icon: "info"});
        update();
    });

    socket.on('orderComplete', (data) => {
        swal("訂單已完成!!", "訂單編號 #" + data["orderNumber"], {timer: 10000, icon: "info"});
        update();
    });

    socket.on('orderCancel', (data) => {
        swal("訂單取消!!", "訂單編號 #" + data["orderNumber"], {timer: 10000, icon: "success"});
        update();
    });
    //All Trigger Button Action
    $("#allaccept").click(function () {
        swal("確定接收所有的訂單？", {
                buttons: {
                    ok: {
                        text: "確定",
                        value: "ok",
                    },
                    cancel: "Cancel"
                },
            })
            .then((value) => {
                switch (value) {
                    case "ok":
                        eventAllAccept = true;
                        $(".accept").click();
                        setTimeout(function () {
                            eventAllAccept = false;
                        }, 10);
                        addNoty("已接受全部訂單", notyType.success);
                        //console.log("YES");
                        break;
                    default:
                        break;
                };
            });
    })
    $("#btnSort").mouseup(function () {
        setTimeout(function () {
            sortStatus = $('input[name="options"]:checked').val();
            updateData();
        }, 10);
    });

    btnPage();
    btnTrigger();

    ///example is a variable       use test
    //example = JSON.parse(example);
    //data = example;
    //updateData();

    //Notification
    $("#onNotice").bootstrapSwitch({
        size: "mini"
    });
    $("#onNotice").on('switchChange.bootstrapSwitch', function (event, state) {
        onNotice = state;
    });
    
    $.ajax({
        sync: false,
        url: "/getMenu",
        type: "get",
        cache: false,
        data:{},
        success: function(data)
        {
            selectDom = document.createElement("select");
            selectDom.setAttribute('multiple', true);
            for(var one of data)
            {
                if(! (one.type in mealTable))
                    mealTable[one.type] = [];
                var option = document.createElement("option");
                option.value = one.name;
                option.innerHTML = one.name;
                selectDom.appendChild(option);
            }
        },
    });
    //boList_init
}
addEventListener("load", boList_init, false);
