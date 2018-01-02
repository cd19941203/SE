var database = require('./database.js');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;

async function createUser(){
    
}

async function getAccountType(account){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:account},(err,result)=>{
                if(err){
                    rej(dbManipulationError);
                }
                else{
                    if(result){
                        res(result['type']);
                    }
                    else{
                        res(null);
                    }
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
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
                    if(result && result['password'] == password)
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

async function getUserInfo(account){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user'),findOne({account:account},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    if(result){
                        res(result);
                    }
                    else{
                        rej("do not find the user");
                    }
                }
            });
        });
    }
    catch(err){
        throw(dbConnectionError);
    }
}

module.exports.getAccountType = getAccountType;
module.exports.createUser = createUser;
module.exports.login = login;
module.exports.getUserInfo =  getUserInfo;