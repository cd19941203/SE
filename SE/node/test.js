var database = require('./database.js');

async function init(){
	try{
		var db = await database.connect();
		db.collection('User').find({account:'root'}).toArray((err,result)=>{
		for(i of result){
				console.log(i.account);
				console.log(i.password);
			}
		});
		console.log(conn);
	}catch(err){
		console.log(err);
		return ;
	}
}

init();


/*
db.collection('User').find({account:'root'}).toArray((err,result)=>{
	for(i of result){
		console.log(i.account);
		console.log(i.password);
	}
});
*/