var example = [{"type":"套餐","name":"蛋餅套餐","item":["起司蛋餅","紅茶(大杯)"],"price":40,"inventory":true,"image":null},{"type":"蛋餅","name":"起司蛋餅","price":25,"inventory":true,"image":null},{"type":"蛋餅","name":"原味蛋餅","price":20,"inventory":true,"image":null}];
var data = [];
var category = [];
var menu = [];

var myData = [];
var myCategory = [];
var myMenu = [];
var myViewCategory = 0;

function updateMenu(){
	var str="";
	if(!EditMode){
		for (var categoryList in menu[ category[viewCategory] ]){
			var mydata = menu[ category[viewCategory] ][ categoryList ];
			str += 
			'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
			'                        <div class="thumbnail">                                                                      '+
			'                            <img src="'+ data[mydata].image +'" onerror="noImage(this);" alt="" style = "width:100%">                                                        '+
			'                            <div class="caption">                                                                    '+
			'                                <h4>                                                                                 '+
			'									<span class = "glyphicon glyphicon-search"></span>                      '+
			'									<B>' + data[mydata].name + '</B>                                               '+
			'                                </h4>                                                                                '+
			'                                <p>                                                                                  '+
			'沒有內容OUO'+                                                                                                        
			'								</p>                                                                                  '+
			'								<hr style = "margin:0px;">                                                            '+
			'                            </div>                                                                                   '+
			'                            <div class="ratings">                                                                    '+
			'								<button class = "btn btn-success pull-right btn-elect" id = "'+mydata+'">編輯</button>'+
			'								<span style = "font-size:20px;">NT<B>$ '+ (data[mydata].price).toLocaleString('en-US') +'</B></span>                                                                              '+
			'								<br><br>                                                                              '+
			'                            </div>                                                                                   '+
			'                        </div>                                                                                       '+
			'                    </div>                                                                                           ';
		}
	}
	else{
		for (var categoryList in myMenu[ myCategory[myViewCategory] ]){
			var mydata = myMenu[ myCategory[myViewCategory] ][ categoryList ];
			str += 
			'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
			'                        <div class="thumbnail">                                                                      '+
			'                            <img src="'+ myData[mydata].image +'" onerror="noImage(this);" alt="" style = "width:100%">                                                        '+
			'                            <div class="caption">                                                                    '+
			'                                <h4>                                                                                 '+
			'									<span class = "glyphicon glyphicon-search"></span>                      '+
			'									<B>' + myData[mydata].name + '</B>                                               '+
			'                                </h4>                                                                                '+
			'                                <p>                                                                                  '+
			'沒有內容OUO'+                                                                                                        
			'								</p>                                                                                  '+
			'								<hr style = "margin:0px;">                                                            '+
			'                            </div>                                                                                   '+
			'                            <div class="ratings">                                                                    '+
			'								<button class = "btn btn-success pull-right btn-elect" id = "'+mydata+'">編輯</button>'+
			'								<span style = "font-size:20px;">NT<B>$ '+ (myData[mydata].price).toLocaleString('en-US') +'</B></span>                                                                              '+
			'								<br><br>                                                                              '+
			'                            </div>                                                                                   '+
			'                        </div>                                                                                       '+
			'                    </div>                                                                                           ';
		}
	}
	$('#MenuPage').html(str);
	btnTrigger();
}

function noImage(test){
	if(debugMode)console.log("NoImage is   "+test);
	test.src = "image/null.jpg";
}