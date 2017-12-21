var database = require('./database.js');

async function init(){
	try{
		var conn = await database.connect();
		console.log(conn);
	}catch(err){
		console.log(err);
		return ;
	}
}

init();