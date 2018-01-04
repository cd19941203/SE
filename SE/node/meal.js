var database = require('./database.js');

async function getMenu(){
	try{
		var db = await database.connect();
		return new Promise((res,rej)=>{
			db.collection('user').find({account:'root'},{projection:{_id: 0}}).toArray((err,result)=>{
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

async function addMeal(){
;
}

module.exports.getMenu = getMenu;
module.exports.addMeal = addMeal;
//module.exports.updateMenu = updateMenu;