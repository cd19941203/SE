function cuSetting_init(){
	$('#inputfile').change(function(){
		var tmp = ($(this).val()).split('\\');
		console.log(tmp);
		tmp = tmp[ tmp.length-1 ];
		$('#filename').html( tmp );
	});
}
addEventListener('load',cuSetting_init,false);