var database = require('./database.js');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;

async function createUser(){
    
}

async function login(account,password){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:account},(err,result)=>{
                if(err){
                    rej(dbManipulationError);
                }
                else{
                    if(result['password'] == password)
                        res(true);
                    else
                        res(false);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

module.exports.createUser = createUser;
module.exports.login = login;