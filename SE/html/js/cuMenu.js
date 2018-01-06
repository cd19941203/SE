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
	
	updateMenu(viewCategory);
	btnTrigger();
}
function viewOrderPage(orderID, isEdit = false, myEdit = []){
	if(debugMode)console.log("click " + orderID + " 訂購");
	viewStatus = "order";
	
	$('#OP_id').html(orderID);
	$('#OP_name').html(data[orderID].name);
	$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
	updateOption();
	updateSumPrice();
	
	$('#MenuPage').hide();
	$('#orderPage').show();
}
function updateSumPrice(){
	$('#OP_sumPrice').html( data[$('#OP_id').html()].price * parseInt($('#singleOrder').html()));
}
//function about Order Page 'Option'
//input example:   [['單點','count'],['套餐','count']];
function updateOption(  myOption = [['單點','singleOrder']]  , isEdit = false, myEdit = []){
	var mystr = "";
	
	for(var i=0;i<myOption.length;i++)
	{
		mystr+="<span>\n";
		
		mystr+='<span class = "mytitle" id = "Option' + i + '">'+ myOption[i][0] +'</span>：<br>';
		mystr+=btnStr[ myOption[i][1] ];
		mystr+="</span>\n";
	}
	
	$('#orderOption').html(mystr);
	
	$('#addOrder').unbind('click');
	if(isEdit)
	{
		for(var i=0;i<myEdit.length;i++)
		{
			setOption(i,myEdit[i]);
		}
		
		$('#addOrder').click(function(){
			$('#MenuPage').show();
			$('#orderPage').hide();
			addOrder(true);
		});
	}
	else
	{
		$('#addOrder').click(function(){
			$('#MenuPage').show();
			$('#orderPage').hide();
			addOrder(false);
		});
	}
	btnTrigger();
}
function addOrder(isEdit = false){
	var myName = data[ $('#OP_id').html() ].name;
	var myType = data[ $('#OP_id').html() ].type;
	if(myOrder[myType]==undefined){myOrder[myType]=[];}
	if(myOrder[myType][myName]==undefined){myOrder[myType][myName]=0;}
	if(!isEdit)
	{
		myOrder[myType][myName]+= parseInt($('#singleOrder').html());
	}
	else
	{
		myOrder[myType][myName] = parseInt($('#singleOrder').html());
	}
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
		updateSumPrice();
	});
	$('.btn-reduce').unbind('click');
	$('.btn-reduce').click(function(){
		if(debugMode)console.log('btn-reduce click');
		$(this).siblings('.order-number').html(function(index,oldvalue){
			if(parseInt(oldvalue)>1)return parseInt(oldvalue)-1;
			return 1;
		});
		updateSumPrice();
	});
	//addOrder.click    in cuMenuData [function updateOption]
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
	});
	$('#clearAll').click(function()
	{
		myOrder = [];
	});
	btnTrigger();
	
	
	data = example;
	viewCategory = 1;
	updateData(data);
}
addEventListener('load', init, false);