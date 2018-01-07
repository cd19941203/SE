var debugMode = true;
var isSort = false;
var viewStatus = "menu";
var viewCategory = 0;

//--------------------------- Function about Action ---------------------------//
function addNoty(message, myType = notyType.info)
{
	var noty = new Noty({
		theme: 'bootstrap-v3',
		text: message,
		type: myType,
		layout: 'bottomRight',
		timeout: 4000
	}).show();
}

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
	$('#categoryList').html(myCategory);
	updateMenu();
	btnTrigger();
}
function viewMenuPage(){
	updateMenu();
	$('#MenuPage').show();
	$('#orderPage').hide();
}
function viewOrderPage(orderID, myOption = [['單點','singleOrder']]  , isEdit = false, myEdit = []){
	if(debugMode)console.log("click " + orderID + " 訂購");
	viewStatus = "order";
	
	$('#OP_id').html(orderID);
	$('#OP_name').html(data[orderID].name);
	$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
	$('#OP_image')[0].src='image/mealImage/'+data[orderID].name+'.jpg';
	updateOption(myOption,isEdit,myEdit);
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
	if(myOrder[myType][myName]==undefined){
		myOrder[myType][myName]=0;
		myOrderIndex.push([myType,myName]);
	}
	if(!isEdit)
	{
		myOrder[myType][myName]+= parseInt($('#singleOrder').html());
	}
	else
	{
		myOrder[myType][myName] = parseInt($('#singleOrder').html());
	}
	updateOrderList();
}
function updateOrderList(){
	if(isSort)
	{
		var myStr = "";
		var arrI = Object.getOwnPropertyNames(myOrder);
		for(var i=1;i<arrI.length;i++){
			myStr+=
				'<li class = "top-li">'+
					'<span class = "order_Category">'+arrI[i]+'</span>'+
					'<ul>';
			var arrJ = Object.getOwnPropertyNames(myOrder[ arrI[i] ]);
			for(var j=1;j<arrJ.length;j++)
			{
				myStr+='<li>';
				myStr+=	'<span class = "order_name">'+
						'	'+arrJ[j]+
						'	<span>x<B>'+ myOrder[ arrI[i] ][ arrJ[j] ] +'</B></span>'+
						'</span>'+
						'<span>'+
						'	<div class = "information" id = "info_'+menu[ arrI[i] ][ myOrder[ arrI[i] ] ]+'"hidden>'+arrI[i]+','+myOrder[ arrI[i] ]+','+myOrder[ arrI[i] ][ arrJ[j] ]+'</div>'+
						'	<span class = "glyphicon glyphicon-edit cuMenu-btn cuMenu-btn-edit"></span>'+
						'	<span class = "glyphicon glyphicon-remove cuMenu-btn cuMenu-btn-remove"></span> '+
						'</span>';
				myStr+='</li>';
			}
			myStr+='</ul></li>';
		}
		$('#order_list').html(myStr);
	}
	else
	{
		var myStr = "";
		for(var i=0;i<myOrderIndex.length;i++){
			myStr+='<li class = "top-li">';
			myStr+=	'<span class = "order_name">'+
					'	'+myOrderIndex[i][1]+
					'	<span>x<B>'+ myOrder[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ] +'</B></span>'+
					'</span>'+
					'<span>'+
					'	<div class = "information" id = "info_'+menu[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ]+'"hidden>'+myOrderIndex[i][0]+','+myOrderIndex[i][1]+','+myOrder[ myOrderIndex[i][0] ][ myOrderIndex[i][1] ]+'</div>'+
					'	<span class = "glyphicon glyphicon-edit cuMenu-btn cuMenu-btn-edit"></span>'+
					'	<span class = "glyphicon glyphicon-remove cuMenu-btn cuMenu-btn-remove"></span> '+
					'</span>';
					
			if(myOrderIndex[i][1] == "套餐"){
				myStr+='<ul>';
				/*for(var j=1;j<arrJ.length;j++)
				{
					myStr+='<li>';
					myStr+=	
					myStr+='</li>';
				}*/
				myStr+='</ul>';
			}
			myStr+='</li>';
		}
		$('#order_list').html(myStr);
	}
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
        update();
		$('#cancelOrder').click();
	});
	$('#cancelOrder').unbind('click');
	$('#cancelOrder').click(function(){
		viewMenuPage();
	});
}

function timelyCategoryDelete(index)
{
	if($('#info_'+index).length==0)return;
	addNoty('[缺貨通知] ' + data[index].name + ' 已從清單中移除', notyType.error);
	$('#info_'+index).siblings('.cuMenu-btn-remove').click();
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
    $('#submitOrder').click(submitOrder);
	btnTrigger();
 
	
	data = example;
	viewCategory = 0;
	updateData(data);
}
addEventListener('load', init, false);