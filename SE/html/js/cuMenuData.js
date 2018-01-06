var viewStatus = "menu";
var viewCategory = 0;
var example = [{"type":"套餐","name":"蛋餅套餐","item":["起司蛋餅","紅茶(大杯)"],"price":40,"inventory":true,"image":null},{"type":"蛋餅","name":"起司蛋餅","price":25,"inventory":true,"image":null},{"type":"蛋餅","name":"原味蛋餅","price":20,"inventory":true,"image":null}];
var data = [];
var category = [];
var menu = [];


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
function updateMenu(){
	var str="";
	for (var categoryList in menu[ category[viewCategory] ]){
		var mydata = menu[ category[viewCategory] ][ categoryList ];
		str += 
		'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
		'                        <div class="thumbnail">                                                                      '+
		'                            <img src="image/null.jpg" alt="">                                                        '+
		'                            <div class="caption">                                                                    '+
		'                                <h4 class="pull-right">NT$ '+ (data[mydata].price).toLocaleString('en-US') +'</h4>  '+
		'                                <h4>                                                                                 '+
		'									<span class = "glyphicon glyphicon-heart" style = "color:#B22222;"></span>        '+
		'									<B>' + data[mydata].name + '</B>                                               '+
		'                                </h4>                                                                                '+
		'                                <p>                                                                                  '+
		'沒有內容OUO'+                                                                                                        
		'								</p>                                                                                  '+
		'								<hr style = "margin:0px;">                                                            '+
		'                            </div>                                                                                   '+
		'                            <div class="ratings">                                                                    '+
		'								<button class = "btn btn-success pull-right btn-elect" id = "'+mydata+'">訂購</button>'+
		'								<br><br>                                                                              '+
		'                            </div>                                                                                   '+
		'                        </div>                                                                                       '+
		'                    </div>                                                                                           ';
	}
	$('#MenuPage').html(str);
}





//function about Order Page
function viewOrderPage(orderID, isEdit = false, myEdit = []){
	if(debugMode)console.log("click " + orderID + " 訂購");
	viewStatus = "order";
	
	$('#OP_id').html(orderID);
	$('#OP_name').html(data[orderID].name);
	$('#OP_price').html( (data[orderID].price).toLocaleString('en-US') );
	updateOption();
	
	
	$('#MenuPage').hide();
	$('#orderPage').show();
}
function updateSumPrice(){
	$('#OP_sumPrice').html( data[$('#OP_id').html()].price * parseInt($('#singleOrder').html()));
}

var btnStr = Object.freeze({
	count: 
	'<div class = "optionChoose" style = "padding : 5px;">                                                                                                     '+
	'	<button class = "btn btn-success btn-add" style = "height:30px;padding:0px;width:30px;">＋</button>                                                    '+
	'	<span class = "panel panel-default order-number" style = "margin-left:10px;margin-right:10px;width:30px;text-align: right;">1</span>                   '+
	'	<button class = "btn btn-danger btn-reduce" style = "height:30px;padding:0px;width:30px;">－</button>                                                  '+
	'</div>                                                                                                                                                    ',
	singleOrder: 
	'<div class = "optionChoose" style = "padding : 5px;">                                                                                                     '+
	'	<button class = "btn btn-success btn-add" style = "height:30px;padding:0px;width:30px;">＋</button>                                                    '+
	'	<span class = "panel panel-default order-number" id = "singleOrder" style = "margin-left:10px;margin-right:10px;width:30px;text-align: right;">1</span>'+
	'	<button class = "btn btn-danger btn-reduce" style = "height:30px;padding:0px;width:30px;">－</button>                                                  '+
	'</div>                                                                                                                                                    '});
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
	if(isEdit)
	{
		for(var i=0;i<myEdit.length;i++)
		{
			setOption(i,myEdit[i]);
		}
	}
	btnTrigger();
}
function setOption(optionIndex,value = 1)
{
	return $('#Option'+optionIndex).siblings('.optionChoose').children('.order-number').html(value);
}
function getOption(optionIndex)
{
	return $('#Option'+optionIndex).siblings('.optionChoose').children('.order-number').html();
}