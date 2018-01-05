var database = require('./database.js');
var fs = require('fs');
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
            db.collection('user').findOne({account:account},(err,result)=>{
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
        
async function createAccount(data,imagePath){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:data.account},(err,result)=>{
                if(result){
                    rej('account already exists');
                }
                else{
                    data['image'] = data.account + '.jpg';
                    data['birth'] = new Date(data['birth']);
                    db.collection('user').insertOne(data,(err,result)=>{
                        if(err)
                            rej(dbManipulationError);
                        else{
                            fs.renameSync(imagePath,'../user_image/'+data.account+'.jpg');
                            res();
                        }
                    });
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

module.exports.getAccountType = getAccountType;
module.exports.createAccount = createAccount;
module.exports.login = login;
module.exports.getUserInfo =  getUserInfo;