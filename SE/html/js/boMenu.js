var debugMode = true;
var isSort = false;
var viewStatus = "menu";
var viewCategory = 0;
var EditMode = false;
var thisIsNewMeal = false;
//--------------------------- Function about Data   ---------------------------//
function updateCategory(){
	var myCategory = "";
	if(!EditMode){
		for(var i=0;i<category.length;i++)
		{
			myCategory += '<a href="#" class="list-group-item category" id = "c_'+i+'">'+category[i]+'</a>';
		}
	}
	else
	{
		for(var i=0;i<editCategory.length;i++)
		{
			myCategory += '<a href="#" class="list-group-item category" id = "c_'+i+'">'+editCategory[i]+'</a>';
		}
	}
	if(!EditMode)myCategory += '<a href="#" class="list-group-item categoryAdd" id = "c_add" style = "display:none; color:MediumBlue;">新增...</a>';
	else myCategory += '<a href="#" class="list-group-item categoryAdd" id = "c_add" style = "color:MediumBlue;">新增...</a>';
	$('#categoryList').html(myCategory);
	btnTrigger();
}
function updateData(myData)
{
	category = [];
	menu = {};
	for(var i=0; i < myData.length ; i++)
	{
		if(menu[ myData[i].type ] == undefined)
		{
			if(debugMode)console.log('add a category name is '+myData[i].type);
			menu[ myData[i].type ] = {};
			category.push(myData[i].type);
		}
		menu[ myData[i].type ][ myData[i].name ] = i;
	}
	updateCategory();
	updateMenu();
	btnTrigger();
}
function viewMenuPage(){
	if(EditMode)$('#addMealItem').show();
	updateMenu();
	$('#MenuPage').show();
	$('#orderPage').hide();
	viewStatus = "menu";
}
function viewOrderPage(orderID,isNew = false){
	$('#addMealItem').hide();
	if(debugMode)console.log("click " + orderID + " 編輯");
	viewStatus = "order";
	
	//clearData
	$('#name').val("");
	$('#price').val(0);
	$('#divUpload').html(
		'<label for="usr">照片:</label><br>                                                                                     '+
		'<div class="col-sm-6 col-lg-6 col-md-6" style = "padding-left : 5px;">                                                 '+
		'	<span id = "filename" title = "None">None</span>                                                                    '+
		'</div>                                                                                                                 '+
		'<div class="col-sm-6 col-lg-6 col-md-6">                                                                               '+
		'	<a href="javascript:;" class="a-upload pull-right" style = "height: 30px;">                                         '+
		'		<input type="file" id="inputfile" accept="image/png,image/jpeg" >Upload</input>                                 '+
		'	</a>                                                                                                                '+
		'</div>                                                                                                                 ');
	$('#comboMealOrder').html("");
	$('#comboMealNumber').val(1);
	
	$('#OP_id').html(orderID);
	if(!isNew){
		if(category[viewCategory] == "套餐")$('#comboMeal').show();
		else $('#comboMeal').hide();
		$('#OP_name').html(data[orderID].name);
		$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
		$('#OP_image')[0].src='image/mealImage/'+data[orderID].name+'.jpg';
	}
	else{
		if(editCategory[editViewCategory] == "套餐")$('#comboMeal').show();
		else $('#comboMeal').hide();
		$('#OP_name').html("新資料");
		$('#OP_price').html( "0" );
		$('#OP_image')[0].src='/mealImage/default.jpg';
		thisIsNewMeal = true;
	}
	updateComboMeal();
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
		editViewCategory = parseInt($(this).attr('id').substr(2));
		updateMenu();
	});
	$('#cancelOrder').unbind('click');
	$('#cancelOrder').click(function(){
		viewMenuPage();
		thisIsNewMeal = false;
	});
	$('#inputfile').unbind('click');
	$('#inputfile').change(function(){
		
		var tmp = ($(this).val()).split('\\');
		console.log(tmp);
		tmp = tmp[ tmp.length-1 ];
		$('#filename').html( tmp );
		$('#filename').attr('title', ($(this).val()).replace(/fakepath/,"...") );
	});
	$('#editOrder').unbind('click');
	$('#editOrder').click(function(){
		if(thisIsNewMeal)
		{
			
			
			
			
		}
		else
		{
			
			
			
			
		}
		thisIsNewMeal = false;
		viewMenuPage();
	});
	
	
	//function about EditMode
	
	$('#editCancel').click(function(){
		updateCategory();
	});
	$('#edit').unbind('click');
	$('#edit').click(function(){
		if(viewStatus != "menu"){
			addNoty("請先回到菜單頁面後再次嘗試。",notyType.error);
			return;
		}
		EditMode = !EditMode;
		if(EditMode)
		{
			$('#edit').addClass('btn-warning');
			$('#edit').removeClass('btn-success');
			$('#edit').html("完成");
			$('#editCancel').show();
			$('#c_add').show();
			$('#addMealItem').show();
			$('.btn-elect').show();
			
			//set initial  My menu variable			
			editData = JSON.parse(JSON.stringify(data));
			editCategory = JSON.parse(JSON.stringify(category));
			editMenu = JSON.parse(JSON.stringify(menu));
			editViewCategory = JSON.parse(JSON.stringify(viewCategory));
			//update select
			updateComboMeal();
		}
		else
		{
			$('#edit').addClass('btn-success');
			$('#edit').removeClass('btn-warning');
			$('#edit').html("編輯");
			$('#editCancel').hide();
			$('#c_add').hide();
			$('#addMealItem').hide();
			$('.btn-elect').hide();
		}
	});
	$('#editCancel').unbind('click');
	$('#editCancel').click(function(){
		if(viewStatus != "menu"){
			addNoty("請先回到菜單頁面後再次嘗試。",notyType.error);
			return;
		}
		EditMode = !EditMode;
		$('#edit').addClass('btn-success');
		$('#edit').removeClass('btn-warning');
		$('#edit').html("編輯");
		$('#editCancel').hide();
		$('#c_add').hide();
		$('#addMealItem').hide();
		$('.btn-elect').hide();
	});
	$('#c_add').unbind('click');
	$('#c_add').click(function(){
		swal("NAME?", {
			closeOnClickOutside: false,
			buttons: {
				OK: {
					text: "OK",
					value: "OK",
				},
				cancel: "Cancel"
			},
		})
		.then((value) => {
			switch (value) {
				case "OK":
					var myTmp = "test";
					//doSomething
					editCategory.push(myTmp);
					updateCategory();
					console.log("QQ");
					break;
				default:
					break;
			}
	})});
	$('#addMeal').unbind('click');
	$('#addMeal').click(function(){
		viewOrderPage( editData.length ,true);
	});
	$('#comboAddMealBtn').unbind('click');
	$('#comboAddMealBtn').click(function(){
		if( $('#comboMealOrder').html()=="(空白)" ) $('#comboMealOrder').html("");
		
		var myCategory = $(':selected', $('#comboMealSelect')).closest('optgroup').attr('label');
		var myMeal = $(':selected', $('#comboMealSelect')).val();
		var myStr = editData[ editMenu[ myCategory ][ myMeal ] ].name;
		myStr += ' x' + $('#comboMealNumber').val();
		
		
		myStr = '<span class = "a-click comboAddMeal myDel">'+ myStr +'<br></span>';
		$('#comboMealOrder').html($('#comboMealOrder').html()+myStr);
		
		$('.comboAddMeal').unbind('click');
		$('.comboAddMeal').click(function(){
			console.log( $(this).html() );
			$(this).remove();
		});
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
		myOrder = {};
		myOrderIndex = {};
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