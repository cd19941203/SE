var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:root@192.168.1.138:27017';
var dbConnectionError = 'Database conneciton error';
var dbManipulationError = 'Database error 0x12';

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
module.exports.dbConnectionError = dbConnectionError;
module.exports.dbManipulationError = dbManipulationError;