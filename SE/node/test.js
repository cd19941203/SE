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

/*

db.collection('User').query({account:'root'}).toArray((err,result)=>{
	for(i of result){
		console.log(i.account);
		console.log(i.password);
	}
});