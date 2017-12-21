var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:root@192.168.1.138:27017/SE'

function connect(collectionName){
	return new Promise((res,rej)=>{
		MongoClient.connect(url,(err,db)=>{
			if(err)
				rej(err);
			else{
				res(db.collection(collectionName));
			}
		});
	});
}

module.exports.connect = connect;