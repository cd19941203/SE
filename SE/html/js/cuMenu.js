var debugMode = true;
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
	$('#addOrder').unbind('click');
	$('#addOrder').click(function(){
		$('#MenuPage').show();
		$('#orderPage').hide();
	});
	//
}

function init(){
	btnTrigger();
	data = example;
	viewCategory = 1;
	updateData(data);
	
}
addEventListener('load', init, false);