var meal = require('./meal.js');

async function gogo(){
	try{
		var z = await meal.getMenu();
		console.log(z);
	}catch(err){
		console.log(err);
	}
}

gogo();