//The List Button
var btnStr = [];
btnStr['NEW'] =
'				<button type="button" class="btn btn-success accept">Accept</button> '+
'				<button type="button" class="btn btn-warning edit">Edit</button>     '+
'				<button type="button" class="btn btn-danger refuse">Refuse</button>  ';

btnStr['ACCEPT'] =
'				<button type="button" class="btn btn-success ok">OK</button> ';

btnStr['WAIT'] =
'				<button type="button" class="btn btn-success ok">OK</button> '+
'				<button type="button" class="btn btn-danger cancel">Cancel</button>  ';


//ICON
var ICON = [];
ICON['alert'] = "image/icon/alert.png";
ICON['attention'] = "image/icon/attention.png";
ICON['information'] = "image/icon/information.png";
ICON['proihibited'] = "image/icon/proihibited.png";


var example = '[{"account":"test","beginTime":"2017-12-27T11:48:20.460Z","endTime":null,"mealName":["a","b","c"],"setmealName":["d","e","f"],"status":"new"},{"mealName":"蛋餅","account":"87","orderNumber":34,"status":"new","beginTime":"2017-12-27T11:48:20.460Z"},{"mealName":{"蛋餅":1},"account":"87","orderNumber":42,"status":"new","beginTime":"2017-12-25T13:45:02.074Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":43,"status":"new","beginTime":"2017-12-25T14:37:37.632Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":46,"status":"new","beginTime":"2017-12-27T07:23:36.695Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":47,"status":"new","beginTime":"2017-12-27T07:23:56.084Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":48,"status":"new","beginTime":"2017-12-27T07:24:58.431Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":49,"status":"new","beginTime":"2017-12-27T07:25:43.102Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":50,"status":"new","beginTime":"2017-12-27T07:26:05.574Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":53,"status":"new","beginTime":"2017-12-27T07:53:38.664Z"},{"mealName":[{"蛋餅":1}],"account":"client","orderNumber":59,"status":"new","beginTime":"2017-12-27T09:19:26.199Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":61,"status":"new","beginTime":"2017-12-27T17:44:47.682Z"}]';

function webMake(id,name,phone,total,order,star){
	var web_order_str="";
	for(var i=0;i<order.length;i++)
	{
		var plural = "";
		if(order[i][1]>1){
			plural = "x"+order[i][1];
		}
		web_order_str +=
			'			<p>'+order[i][0] + plural + ' <span class = "pull-right">NT$ '+order[i][2]+'</span></p>                 \n';
	}
	var web = 
	'<div class="col-sm-12 col-lg-12 col-md-12">                                         '+
	'	<div class="thumbnail">                                                          '+
	'	                                                                                 '+
	'		<div class = "information">'+id+'</div>                                      '+
	'		                                                                             '+
	'		<div class="caption">                                                        '+
	'			                                                                         '+
	'			<h4>                                                                     '+
	'				<span>#'+id+'</span>                                                 '+
	'				<a href="#">                                                         '+
	'					'+name+'                                                         '+
	'				</a>                                                                 '+
	'				<span>                                                               '+
	'					('+phone+')                                                      '+
	'				</span>                                                              '+
	'				<span class="pull-right font-5">NT$ '+total+'</span>                 '+
	'			</h4>                                                                    '+
	'			                                                                         '+ web_order_str+
	'				                                                                     '+
	'		</div>                                                                       '+
	'		<div class="ratings" style = "height: 40px;">                                '+
	'			<div class = "pull-right ratings myBtn">                                 '+
	'			</div>                                                                   '+
	'			<p>                                                                      '+
	'				可信度：                                                             '+
	'				<span class="glyphicon glyphicon-star"></span>                       '+
	'				<span >'+star+'</span>                                               '+
	'			</p>                                                                     '+
	'		</div>                                                                       '+
	'		                                                                             '+
	'	</div>                                                                           '+
	'</div>                                                                              ';
	document.getElementById("DATA").innerHTML = document.getElementById("DATA").innerHTML + web;
	btnTrigger();
}
