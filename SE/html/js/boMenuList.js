var debugMode = true;
var onEdit = false;
var example = [{"type":"套餐","name":"蛋餅套餐","item":["起司蛋餅","紅茶(大杯)"],"price":40,"inventory":true,"image":null},{"type":"蛋餅","name":"起司蛋餅","price":25,"inventory":true,"image":null},{"type":"蛋餅","name":"原味蛋餅","price":20,"inventory":true,"image":null}];
var allData = [];
var category = [];
var menu = [];
var inventory = [];
function updateData(myData)
{
	category = [];
	menu = [];
	for(var i=0; i < myData.length ; i++)
	{
		if(menu[ myData[i].type ] == undefined)
		{
			if(debugMode)console.log('add a category name is '+myData[i].type);
			menu[ myData[i].type ] = [];
			category.push(myData[i].type);
		}
		menu[ myData[i].type ][ myData[i].name ] = i;
	}
    var str = "";
    var tmpName=[];
    var counter = 0;
    for(var i=0;i<category.length;i++){
        str+=
        '<div class="col-md-3">                                                  '+
        '	<h3 class ="mytitle">'+category[i]+'</h3>                                       '+
        '	<div class="list-group">                                             ';


        tmpName = Object.getOwnPropertyNames(menu[category[i]]);
        for(var j=1;j<tmpName.length;j++)
        {
            if(allData[menu[category[i]][tmpName[j]]].inventory)
                str+='	    <a href="#" class="list-group-item" id = "'+ category[i] +'_'+ j +'">'+ tmpName[j] +'</a>';
            else
            {
                str+='	    <a href="#" style="text-decoration:line-through" class="list-group-item list-group-item-danger" id = "'+ category[i] +'_'+ j +'">'+ tmpName[j] +'</a>';
                if(inventory[category[i]]==undefined){inventory[category[i]] = [];}
                if(inventory[category[i]][tmpName[j]]==undefined)inventory[category[i]][tmpName[j]] = menu[category[i]][tmpName[j]];
            }
            counter++;
        }

        str+=
        '	</div>                                                               '+
        '</div>                                                                  ';
    }
    $('#MenuList').html(str); 

    $("#edit").click(function(){
        if(onEdit)
        {
            $(this).removeClass("btn-warning");
            $(this).addClass("btn-success");
            $(this).html("編輯");
            updateInventory();
        }
        else
        {
            $(this).removeClass("btn-success");
            $(this).addClass("btn-warning");
            $(this).html("完成");
        }
        onEdit = !onEdit;
    });
    $(".list-group-item").click(function(){
        if(!onEdit)return;
        var myCategory = $(this).attr('id').split('_')[0];
        console.log(myCategory);
        var myName = $(this).html();
        console.log(myName);
        if( $(this).hasClass("list-group-item-danger") )
        {
            $(this).removeClass("list-group-item-danger");
            $(this).attr('style','');
            console.log('del');
            delete inventory[myCategory][myName];
        }
        else
        {
            $(this).addClass("list-group-item-danger");
            $(this).attr('style','text-decoration:line-through');
            console.log('add');
            if(inventory[myCategory]==undefined){inventory[myCategory] = [];}
            if(inventory[myCategory][myName]==undefined)inventory[myCategory][myName] = menu[myCategory][myName];
        }
        if(Object.getOwnPropertyNames(inventory[myCategory]).length == 1) //is empty
        {
            delete inventory[myCategory];
        }
        console.log('inventory is');
        console.log(inventory);
        //$(".list-group-item-danger").each(function(){ console.log($(this).attr("id")) });
    });
}

function init(){
	//updateData(example);
    $.ajax({
        url: "/getMenu",
        type: "get",
        cache: false,
        dataType: 'json',
        data:{},
        success: function(data)
        {
            allData = data;
            updateData(data);
        },
    });

}

function updateInventory()
{
    for(var meal of allData)
    {
        meal.inventory = true;
    }
    var arr = [];
    for(var type in inventory)
    {
        for(var meal in inventory[type])
        {
            arr.push(meal);
        }
    }
    $.ajax({
        url: "/soldOut",
        type: "post",
        cache: false,
        dataType: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify(arr)
        ,
        success: function(data)
        {
            swal("餐點狀態更新", "", {timer:10000,icon:"success"});
        },
    });
}

addEventListener("load",init,false);