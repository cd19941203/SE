var database = require('./database.js');

async function getMenu(){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection('user').find({account:'root'}).toArray((err,result)=>{
				if(err)
					rej(err);
				else
					res(result);
			});
		});
	}catch(err){
		console.log(err);
		return ;
	}
}

module.exports.getMenu = getMenu;