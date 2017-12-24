function removeList(){
	$(".accept").click( 
		function(){
			$(this).parent().parent().parent().parent().fadeOut(400);
		}
	);
}
addEventListener("load",removeList,false);