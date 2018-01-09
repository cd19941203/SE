var example = [{"type":"套餐","name":"蛋餅套餐","item":["起司蛋餅","紅茶(大杯)"],"price":40,"inventory":true,"image":null},{"type":"蛋餅","name":"起司蛋餅","price":25,"inventory":true,"image":null},{"type":"蛋餅","name":"原味蛋餅","price":20,"inventory":true,"image":null}];
var data = [];
var category = [];
var menu = [];

var editData = [];
var editCategory = [];
var editMenu = [];
var editViewCategory = 0;
var uploadImages = {};

function updateMenu(){
	var str="";
	if(!EditMode){
		for (var categoryList in menu[ category[viewCategory] ]){
			var mydata = menu[ category[viewCategory] ][ categoryList ];
			str += 
			'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
			'                        <div class="thumbnail">                                                                      '+
			'                            <div style = "width: 100%; height: 200px; display: table-cell; vertical-align: middle;"> '+
			'                                <img src="'+ data[mydata].image +'" onerror="noImage(this);" alt="">                 '+
			'                            </div>                                                                                   '+
			'                            <div class="caption">                                                                    '+
			'                                <h4>                                                                                 '+
			'									<span class = "glyphicon glyphicon-tag"></span>                      '+
			'									<B>' + data[mydata].name + '</B>                                               '+
			'                                </h4>                                                                                '+
			'                                <p>                                                                                  '+
			''+                                                                                                        
			'								</p>                                                                                  '+
			'								<hr style = "margin:0px;">                                                            '+
			'                            </div>                                                                                   '+
			'                            <div class="ratings">                                                                    '+
			'								<button class = "btn btn-success pull-right btn-elect" id = "'+mydata+'" style = "display:none;">編輯</button>'+
			'								<span style = "font-size:20px;">NT<B>$ '+ (data[mydata].price).toLocaleString('en-US') +'</B></span>                                                                              '+
			'								<br><br>                                                                              '+
			'                            </div>                                                                                   '+
			'                        </div>                                                                                       '+
			'                    </div>                                                                                           ';
		}
	}
	else{
		for (var categoryList in editMenu[ editCategory[editViewCategory] ]){
			var mydata = editMenu[ editCategory[editViewCategory] ][ categoryList ];
			str += 
			'                    <div class="col-sm-4 col-lg-4 col-md-4">                                                         '+
			'                        <div class="thumbnail">                                                                      '+
			'                            <div style = "width: 100%; height: 200px; display: table-cell; vertical-align: middle;"> '+
			'                                <img src="'+ editData[mydata].image +'" alt="">             '+
			'                            </div>                                                                                   '+
			'                            <div class="caption">                                                                    '+
			'                                <h4>                                                                                 '+
			'									<span class = "glyphicon glyphicon-tag"></span>                                '+
			'									<B>' + editData[mydata].name + '</B>                                              '+
			'                                   <span class = "glyphicon glyphicon-remove cursorPointer btnRemove" id = "remove_'+ editViewCategory +'" style = "color:#CC0000;"></span>'+
			'                                </h4>                                                                                '+
			'                                <p>                                                                                  '+
			''+                                                                                                        
			'								</p>                                                                                  '+
			'								<hr style = "margin:0px;">                                                            '+
			'                            </div>                                                                                   '+
			'                            <div class="ratings">                                                                    '+
			'								<button class = "btn btn-success pull-right btn-elect" id = "'+mydata+'">編輯</button>'+
			'								<span style = "font-size:20px;">NT<B>$ '+ (editData[mydata].price).toLocaleString('en-US') +'</B></span>                                                                              '+
			'								<br><br>                                                                              '+
			'                            </div>                                                                                   '+
			'                        </div>                                                                                       '+
			'                    </div>                                                                                           ';
		}
	}
	if(debugMode)console.log("MenuPage Update");
	$('#MenuPage').html(str);
	btnTrigger();
}