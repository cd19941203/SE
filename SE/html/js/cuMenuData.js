var example = [{"type":"套餐","name":"蛋餅套餐","item":["起司蛋餅","紅茶(大杯)"],"price":40,"inventory":true,"image":null},{"type":"蛋餅","name":"起司蛋餅","price":25,"inventory":true,"image":null},{"type":"蛋餅","name":"原味蛋餅","price":20,"inventory":true,"image":null}];
var data = [];
var category = [];
var menu = [];
var myOrder = [];
var myOrderIndex = [];
function updateMenu(){
	var str="";
	for (var categoryList in menu[ category[viewCategory] ]){
		var mydata = menu[ category[viewCategory] ][ categoryList ];
		str += 
		'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
		'                        <div class="thumbnail">                                                                      '+
		'                            <img src="image/mealImage/'+data[mydata].name+'.jpg" onerror="noImage(this);" alt="" style = "width:100%">                                                        '+
		'                            <div class="caption">                                                                    '+
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
		'								<span style = "font-size:20px;">NT<B>$ '+ (data[mydata].price).toLocaleString('en-US') +'</B></span>                                                                              '+
		'								<br><br>                                                                              '+
		'                            </div>                                                                                   '+
		'                        </div>                                                                                       '+
		'                    </div>                                                                                           ';
	}
	$('#MenuPage').html(str);
	btnTrigger();
}

//function about Order Page


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
	'</div>                                                                                                                                                    '
});

function setOption(optionIndex,value = 1)
{
	return $('#Option'+optionIndex).siblings('.optionChoose').children('.order-number').html(value);
}
function getOption(optionIndex)
{
	return $('#Option'+optionIndex).siblings('.optionChoose').children('.order-number').html();
}
function noImage(test){
	if(debugMode)console.log("NoImage is   "+test);
	test.src = "image/null.jpg";
}