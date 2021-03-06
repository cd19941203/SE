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
			myCategory +=
			'<a href="#" class="list-group-item category" id = "c_'+i+'">'+
				'<span class="glyphicon glyphicon-remove btnRemoveType" style="color:#CC0000;"></span>'+
				editCategory[i]+
			'</a>';
		}

		$(".btnRemoveType").click(function(){
			delete editCategory[category[this.parentElement.id.substr(2)]];
			editMenu[category[this.parentElement.id.substr(2)]] = {};
			for(var i=0; i<editData.length; i++)
			{
				if(editData[i]['type']==category[this.parentElement.id.substr(2)])
				{
					editData.splice(i,1);
					i--;
				}
			}
			
			this.parentElement.remove();
		});
	}
	if(!EditMode)myCategory += '<a href="#" class="list-group-item list-group-item-warning categoryAdd" id = "c_add" style = "display:none;">新增...</a>';
	else myCategory += '<a href="#" class="list-group-item list-group-item-warning categoryAdd" id = "c_add" >新增...</a>';
	$('#categoryList').html(myCategory);
	btnTrigger();
}
function updateData(myData)
{
	category = [];
	menu = {};
    var comboMealSelectDom = document.getElementById('comboMealSelect');
    comboMealSelectDom.innerHTML = '';
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
    for(var type in menu)
    {
        if(type == '套餐')
            continue;
        var group = document.createElement('optgroup');
        group.setAttribute('label', type);
        for(var name in menu[type])
        {
            var option = document.createElement('option');
            option.setAttribute('value', name);
            option.innerHTML = name;
            group.appendChild(option);
        }
        comboMealSelectDom.appendChild(group);
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
	orderID = parseInt(orderID);
    
	$('#OP_id').html(orderID);
	if(!thisIsNewMeal){
		if(category[viewCategory] == "套餐")
        {
            $('#comboMeal').show();
            var itemStr = '';
            for(var i of data[orderID].item)
                itemStr += i + '<br>';
            document.getElementById('item').innerHTML = itemStr;
        }
		else $('#comboMeal').hide();
		$('#OP_name').html(data[orderID].name);
        document.getElementById('name').value = data[orderID].name;
		$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
        document.getElementById('price').value = data[orderID].price;
		$('#OP_image')[0].src=data[orderID].image;
	}
	else{
		if(editCategory[editViewCategory] == "套餐")$('#comboMeal').show();
		else $('#comboMeal').hide();
		$('#OP_name').html("新資料");
		$('#OP_price').html( "0" );
		$('#OP_image')[0].src='/mealImage/default.jpg';
        document.getElementById('item').innerHTML = '';
        document.getElementById('name').innerHTML = '';
        document.getElementById('price').innerHTML = '';
		thisIsNewMeal = true;
	}
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
        var mealID = parseInt($('#OP_id')[0].innerHTML);
        var mealObject = {};
        mealObject.type = editCategory[editViewCategory];
        mealObject.name = document.getElementById('name').value;
        mealObject.price = parseInt(document.getElementById('price').value);
        mealObject.inventory = true;
        mealObject.image = '/mealImage/default.jpg';
		
        if(mealObject.type == "套餐")
        {
            var arr = document.getElementById('item').innerHTML.split('<br>');
            arr.pop();
            mealObject.item = arr;
        }
        if(document.getElementById('inputfile').value != "")
        {
            if(!(mealObject.type in uploadImages))
                uploadImages[mealObject.type] = {};
            uploadImages[mealObject.type][mealObject.name] = document.getElementById('inputfile').files[0];
            document.getElementById('inputfile').value = "";
            document.getElementById('filename').innerHTML = "None";
        }
		
		//if  is Empty
		if(mealObject.name=="")
		{
			addNoty("請輸入餐點名稱",notyType.error);
			return;
		}
		if(mealObject.type == "套餐"){
			if(mealObject.item.length==0)
			{
				addNoty("請輸入套餐內容",notyType.error);
				return;
			}
		}
		if(thisIsNewMeal)
		{
			editData.push(mealObject);
			console.log(editData);
			console.log( editData.length-1 );
			if(editMenu[mealObject.type] === undefined)editMenu[mealObject.type]={};
			editMenu[mealObject.type][mealObject.name] = editData.length-1;
		}
		else
		{
            editData[mealID] = mealObject;
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
			addNoty("請先回到菜單頁面後再次嘗試",notyType.error);
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
			
			var str = '<span class="glyphicon glyphicon-remove btnRemoveType" style="color:#CC0000;"></span>';
			for(var type of document.getElementById("categoryList").children)
				if(type.id != "c_add" && type.innerText != "套餐")
					type.innerHTML = str + type.innerHTML;
			$(".btnRemoveType").click(function(){
				delete editCategory[category[this.parentElement.id.substr(2)]];
				editMenu[category[this.parentElement.id.substr(2)]] = {};
				for(var i=0; i<editData.length; i++)
				{
					if(editData[i]['type']==category[this.parentElement.id.substr(2)])
					{
						editData.splice(i,1);
						i--;
					}
				}
				
				this.parentElement.remove();
			});
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
			
			console.log("尚未刪除的送出資料");
			console.log(editData);
			//delete empty data
			var mul=false;
			for(var i = editData.length-1; i >=0  ;i--)
			{
				if(editData[i]==undefined)
					editData.splice(i,1);
				if(editData[i]["type"]=='套餐')
					mul = true;
			}
			if(!mul)
				editData.push({
						"image":"/mealImage/default.jpg",
						"inventory":true,
						"item":[],
						"name":" ",
						"price":0,
						"type":"套餐"
					});
			console.log("送出資料");
			console.log(editData);
            
            $.ajax({
                async: false,
                url: "/updateMenu",
                type: "post",
                cache: false,
                data: {data:JSON.stringify(editData)},
                success: function(data)
                {
                    swal("更新菜單",data,{timer: 10000, icon: "info"}).then((value)=>{
                        location.reload();
                    });
                },
            });
            for(var type in uploadImages)
            {
                for(var name in uploadImages[type])
                {

                    var form = new FormData();
                    form.append('name',name);
                    form.append('image', uploadImages[type][name]);

                    $.ajax({
                        url: "/setMealImage",
                        type: "post",
                        async: true,
                        data: form,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data)
                        {
                            console.log(data);
                        },
                    });
                }
            }
            
		}
		updateMenu();
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
		updateMenu();
		//$(".btnRemoveType").remove();
		updateCategory();
	});
	$('#c_add').unbind('click');
	$('#c_add').click(function(){
		swal("請輸入餐點種類", {
			closeOnClickOutside: false,
            content: "input",
            buttons: true
		})
		.then((value) => {
            if(value != null && value.trim() != "")
            {
                if(editCategory.indexOf(value)>=0)
                {
                    addNoty("請勿輸入重複餐點種類!!",notyType.error);
                }
                else
                {
                    editCategory.push(value);
                    updateCategory();
                }
            }
	})});
	$('#addMeal').unbind('click');
	$('#addMeal').click(function(){
        thisIsNewMeal = true;
		viewOrderPage( editData.length ,true);
	});
    $('#itemAdd').unbind('click');
    $('#itemAdd').click(function(){
        if(EditMode)
        {
            var selected = document.getElementById('comboMealSelect').options[document.getElementById('comboMealSelect').selectedIndex].value;
            var number = document.getElementById('itemNumber').value;
            var itemStr = document.getElementById('item').innerHTML;
            var from = itemStr.indexOf(selected);
            if(from >= 0)
            {
                var reg = new RegExp(selected+'\\*[0-9]+',"g");
                itemStr = itemStr.replace(reg, selected+'*'+number);
            }
            else
            {
                itemStr += selected+'*'+number+'<br>'
            }
            document.getElementById('item').innerHTML = itemStr;
        }
	});
	$('.btnRemove').unbind('click');
	$('.btnRemove').click(function(){
		swal("確定刪除?", {
			closeOnClickOutside: false,
            buttons: {
				ok: {
					text: "OK",
					value: "ok",
				},
				cancel: "Cancel"
			},
		})
		.then((value) => {
            if(value != null)
            {
				var thisCategory = editCategory[$(this).attr('id').substr(7)];
				var thisMeal = $(this).siblings('b').html();
				delete editData[editMenu[ thisCategory ][ thisMeal ]];
				delete editMenu[thisCategory][thisMeal];
				if(Object.getOwnPropertyNames(editMenu[thisCategory]).length == 0)
				{
					delete editMenu[thisCategory];
				}
				
				swal("操作成功", "已刪除一筆資料", {timer: 10000, icon: "success"});
				$(this).parent().parent().parent().parent().remove();
            }
	})});
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