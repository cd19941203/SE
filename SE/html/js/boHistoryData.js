var example = '[{"mealName":"蛋餅","account":"87","orderNumber":34,"status":"new","beginTime":"2017-12-27T11:48:20.460Z"},{"mealName":{"蛋餅":1},"account":"87","orderNumber":42,"status":"new","beginTime":"2017-12-25T13:45:02.074Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":43,"status":"new","beginTime":"2017-12-25T14:37:37.632Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":46,"status":"new","beginTime":"2017-12-27T07:23:36.695Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":47,"status":"new","beginTime":"2017-12-27T07:23:56.084Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":48,"status":"new","beginTime":"2017-12-27T07:24:58.431Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":49,"status":"new","beginTime":"2017-12-27T07:25:43.102Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":50,"status":"new","beginTime":"2017-12-27T07:26:05.574Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":53,"status":"new","beginTime":"2017-12-27T07:53:38.664Z"},{"mealName":[{"蛋餅":1}],"account":"client","orderNumber":59,"status":"new","beginTime":"2017-12-27T09:19:26.199Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":61,"status":"new","beginTime":"2017-12-27T17:44:47.682Z"}]';
var statusName = Object.freeze({
	'new': ['等待中','btn-warning'],
	'accepted': ['已接受','btn-default'],
	'pending': ['待修改','btn-danger'],
	'completed': ['已完成','btn-success'],
	'notComplete': ['未取餐','btn-success'],
	'done': ['已結單',''],
	'canceled': ['已取消',''],
});
function webMake(id,name,phone,date,total,order,star,myStatus){
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
	date = new Date(date);
	date = date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	var web = 
	'<div class="col-sm-12 col-lg-12 col-md-12">                                         '+
	'	<div class="thumbnail">                                                          '+
	'	                                                                                 '+
	'		<div class = "information">'+id+'</div>                                      '+
	'		                                                                             '+
	'		<div class="caption">                                                        '+
	'			                                                                         '+
	'			<h4 class = "spe01H4">                                                   '+
	'				<i class="fa fa-angle-down btnOrder spe01I"></i>                       '+
	'					<button class = "btn '+ statusName[ myStatus ][1] +'" disabled>'+ statusName[ myStatus ][0] +'</button>';
	'				<span class = "spe01Span">'+'訂餐時間'+'</span>                      '+
	'				<a href="#" class = "spe01A">                                        '+
	'					'+name+'                                                         '+
	'				</a>                                                                 '+
	'				<span class = "spe01Span">                                           '+
	'					('+phone+')                                                      '+
	'				</span>                                                              '+
	'				<span class = "spe01Span">                                           '+
	'					                                                      '+
	'				</span>                                                              '+
	'				<span class="spe01Span-1 font-5">NT$ '+total+'</span>                '+
	'			</h4>                                                                    '+
	'			    <div class = "myOrder" style = "display:none;">	                      '+
	web_order_str+
	'			    </div>                                                               '+
	'				                                                                     '+
	'		</div>                                                                       '+
	'		<div class="ratings" style = "height: 40px;">                                '+
	'			<div class = "pull-right ratings myBtn">                                 '+
	'			</div>                                                                   '+
	'			<p>                                                                      '+
	/*'				可信度：                                                             '+*/
	/*'				<span class="glyphicon glyphicon-star"></span>                       '+
	'				<span >'+star +'</span>                                              '+*/
	'('+date+')'+
	'			</p>                                                                     '+
	'		</div>                                                                       '+
	'		                                                                             '+
	'	</div>                                                                           '+
	'</div>                                                                              ';
	document.getElementById("DATA").innerHTML = document.getElementById("DATA").innerHTML + web;
	btnTrigger();
}