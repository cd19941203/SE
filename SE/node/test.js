var database = require('./database.js');

async function init(){
	try{
		var db = await database.connect();
		db.collection('user').find({account:'root'}).toArray((err,result)=>{
		for(i of result){
				console.log(i.account);
				console.log(i.password);
			}
		});
	}catch(err){
		console.log(err);
		return ;
	}
}
async function orderAccept(num){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:27},{$set:{status:'accepted'}},(err,result)=>{
				console.log(result.result.nModified);
				if(err)
                    rej(dbError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbError);
    }
}

//init();
orderAccept();


/*
console.log('-----');

database.connect().then(db=>{
	db.collection('user').find({account:'root'}).toArray((err,result)=>{
		console.log(result);
	});
}).catch(err=>{
	console.log(err);
});

try{
	JSON.parse('{8as7d}');
}catch(err){
	console.log(typeof err);
}

*/
/*
db.collection('User').find({account:'root'}).toArray((err,result)=>{
	for(i of result){
		console.log(i.account);
		console.log(i.password);
	}
});
*/