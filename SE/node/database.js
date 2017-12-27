var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:root@192.168.1.138:27017'

function connect(){
	return new Promise((res,rej)=>{
		MongoClient.connect(url,(err,db)=>{
			if(err)
				rej('Database connection error');
			else{
				res(db.db('SE'));
			}
		});
	});
}

module.exports.connect = connect;