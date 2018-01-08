var example = [{"mealName":"蛋餅","account":"87","orderNumber":34,"status":"pending","beginTime":"2017-12-27T11:48:20.460Z"},{"mealName":{"蛋餅":1},"account":"87","orderNumber":42,"status":"new","beginTime":"2017-12-25T13:45:02.074Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":43,"status":"new","beginTime":"2017-12-25T14:37:37.632Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":46,"status":"new","beginTime":"2017-12-27T07:23:36.695Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":47,"status":"new","beginTime":"2017-12-27T07:23:56.084Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":48,"status":"new","beginTime":"2017-12-27T07:24:58.431Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":49,"status":"new","beginTime":"2017-12-27T07:25:43.102Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":50,"status":"new","beginTime":"2017-12-27T07:26:05.574Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":53,"status":"new","beginTime":"2017-12-27T07:53:38.664Z"},{"mealName":[{"蛋餅":1}],"account":"client","orderNumber":59,"status":"new","beginTime":"2017-12-27T09:19:26.199Z"},{"mealName":[{"蛋餅":1}],"account":"87","orderNumber":61,"status":"new","beginTime":"2017-12-27T17:44:47.682Z"}];

var statusName = Object.freeze({
	'new': ['等待中','btn-warning'],
	'accepted': ['已接受','btn-default'],
	'pending': ['待修改','btn-danger'],
	'completed': ['已完成','btn-success'],
	'done': ['已結單',''],
	'canceled': ['已取消',''],
});
function webMake(index){
	var isPending = (data[index].status == 'pending');
	var myOrder = "";
	for(var i = 0 ;i < data[index].meal.length ;i++)
	{
		myOrder +='<p>' + data[index].meal[i].name + 'x' + data[index].meal[i].amount +  '<span class = "pull-right">NT$ '+ data[index].meal[i].price +'</span></p>';
	}
	var str = 
'<div class="col-sm-12 col-lg-12 col-md-12">                                                                 '+
'	<div class="thumbnail">                                                                                  '+
'	                                                                                                         '+
'		<div class = "information" id = "id'+ data[index].orderNumber +'"></div>                                               '+
'		                                                                                                     '+
'		<div class="caption">                                                                                '+
'			                                                                                                 '+
'			<h4 class = "spe01H4">                                                                           '+
'				<i class="fa fa-angle-down btnOrder spe01I"></i>                                               '+
'				                                                                                             '+
'				<span class = "spe01Span">                                                                   '+
'					<button class = "btn '+ statusName[ data[index].status ][1] +'" disabled>'+ statusName[ data[index].status ][0] +'</button>';
if(isPending) str+='<span class = "glyphicon glyphicon-info-sign" style = "color:MidnightBlue;font-size:23px;" title = "'+ data[index].advice +'"></span>';
str+='				<span>#'+ data[index].orderNumber +"  "+(data[index].beginTime).replace("T"," ").substr(0,16) +'</span>                 '+
'				</span>                                                                                      '+
'				<span class="spe01Span-1 font-5">NT$ '+ data[index].totalPrice +'</span>                                              '+
'			</h4>                                                                                            '+
'			<div class = "myOrder" style = "display:none;">                                                  '+
myOrder+
'			</div>                                                                                           '+
'		</div>                                                                                               ';
if(isPending)str+='<div class="ratings" style = "height: 40px;">                                             '+
'			<div class = "pull-right myBtn">                                                                 '+
'				<button type="button" class="btn btn-success edit">Edit</button>                             '+
'				<button type="button" class="btn btn-danger refuse">Refuse</button>                          '+
'			</div>                                                                                           '+
'			<br><br>                                                                                         ';
str+='	</div>                                                                                               '+
'		                                                                                                     '+
'	</div>                                                                                                   '+
'</div>                                                                                                      ';
	$("#DATA").html($("#DATA").html()+str);
	btnTrigger();
}
