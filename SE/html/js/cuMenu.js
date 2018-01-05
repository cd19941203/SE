var debugMode = false;
//--------------------------- Function about Trigger---------------------------//
function btnTrigger(){
	$('.btn-elect').click(function(){
		$('#MenuPage').hide();
		$('#orderPage').show();
	});
	//[OrderPage] add and reduce order number
	$('.btn-add').click(function(){
		if(debugMode)console.log('btn-add click');
		$(this).siblings('.order-number').html(function(index,oldvalue){
			return parseInt(oldvalue)+1;
		});
	});
	$('.btn-reduce').click(function(){
		if(debugMode)console.log('btn-reduce click');
		$(this).siblings('.order-number').html(function(index,oldvalue){
			if(parseInt(oldvalue)>1)return parseInt(oldvalue)-1;
			return 1;
		});
	});
	$('#addOrder').click(function(){
		$('#MenuPage').show();
		$('#orderPage').hide();
	});
	//
}

function init(){
	btnTrigger();
}
addEventListener('load', init, false);