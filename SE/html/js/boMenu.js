var debugMode = true;
var isSort = false;
var viewStatus = "menu";
var viewCategory = 0;

//--------------------------- Function about Data   ---------------------------//
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
	var myCategory = "";
	for(var i=0;i<category.length;i++)
	{
		myCategory += '<a href="#" class="list-group-item category" id = "c_'+i+'">'+category[i]+'</a>';
	}
	myCategory += '<a href="#" class="list-group-item categoryAdd" id = "c_add" style = "color:MediumBlue;">新增...</a>';
	$('#categoryList').html(myCategory);
	updateMenu();
	btnTrigger();
}
function viewMenuPage(){
	updateMenu();
	$('#MenuPage').show();
	$('#orderPage').hide();
}
function viewOrderPage(orderID){
	if(debugMode)console.log("click " + orderID + " 編輯");
	viewStatus = "order";
	
	$('#OP_id').html(orderID);
	$('#OP_name').html(data[orderID].name);
	$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
	$('#OP_image')[0].src='image/mealImage/'+data[orderID].name+'.jpg';

	
	$('#MenuPage').hide();
	$('#orderPage').show();
	btnTrigger();
}


//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	$('.btn-elect').unbind('click');
	$('.btn-elect').click(function(){
		viewOrderPage( $(this).attr('id') );
	});
	//[OrderPage] add and reduce order number
	$('.btn-add').unbind('click');
	$('.btn-add').click(function(){
		if(debugMode)console.log('btn-add click');
		$(this).siblings('.order-number').html(function(index,oldvalue){
			return parseInt(oldvalue)+1;
		});
	});
	$('.btn-reduce').unbind('click');
	$('.btn-reduce').click(function(){
		if(debugMode)console.log('btn-reduce click');
		$(this).siblings('.order-number').html(function(index,oldvalue){
			if(parseInt(oldvalue)>1)return parseInt(oldvalue)-1;
			return 1;
		});
	});
	//addOrder.click    in cuMenuData [function updateOption]
	$('.cuMenu-btn-remove').unbind('click');
	$('.cuMenu-btn-remove').click(function(){
		if(debugMode)console.log("remove button click");
		var info = ($(this).siblings('.information').html()).split(',');
		if(debugMode)console.log(info);
		for(var i = 0 ; i < myOrderIndex.length ;i++)
		{
			if(myOrderIndex[i][0] == info[0] && myOrderIndex[i][1] == info[1])
			{
				myOrderIndex.splice(i, 1);
				if(debugMode)console.log("Remove item ["+info[0]+","+info[1]+"] from myOrderIndex");
				break;
			}
		}
		delete myOrder[ info[0] ][ info[1] ];
		$(this).parent().parent().hide();
	});
	$('.cuMenu-btn-edit').unbind('click');
	$('.cuMenu-btn-edit').click(function(){
		if(debugMode)console.log("edit button click");
		var info = ($(this).siblings('.information').html()).split(',');
		if(debugMode)console.log(info);
		viewOrderPage(menu[ info[0] ][ info[1] ],[['單點','singleOrder']],true, [ myOrder[info[0]][info[1]] ]);
	});
	
	$('.category').unbind('click');
	$('.category').click(function(){
		if(debugMode)console.log('categoryItem click');
		viewCategory = parseInt($(this).attr('id').substr(2));
		updateMenu();
	});
	$('#cancelOrder').unbind('click');
	$('#cancelOrder').click(function(){
		viewMenuPage();
	});
	$('#inputfile').unbind('click');
	$('#inputfile').change(function(){
		
		var tmp = ($(this).val()).split('\\');
		console.log(tmp);
		tmp = tmp[ tmp.length-1 ];
		$('#filename').html( tmp );
		$('#filename').attr('title', ($(this).val()).replace(/fakepath/,"...") );
	});
	$('#editOrder').click(function(){
		viewMenuPage();
	});
}

function init(){
	//All Trigger Button Action
	$('#sortOrder').click(function()
	{
		isSort = !isSort;
		if(isSort){
			$(this).removeClass('btn-default');
			$(this).addClass('btn-info');
		}
		else
		{
			$(this).removeClass('btn-info');
			$(this).addClass('btn-default');
		}
		updateOrderList();
	});
	$('#clearAll').click(function()
	{
		myOrder = [];
		myOrderIndex = [];
		$('#order_list').html("");
	});
	btnTrigger();
	update();
	//data = example;
	
	//updateData(data);
}

function update()
{
	$.ajax({
		url: "/getMenu",
		type: "get",
		cache: false,
		data:{},
		success: function(a)
		{
			data = a;
			viewCategory = 0;
			updateData(a);
		},
    });
}
addEventListener('load', init, false);