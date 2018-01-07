var database = require('./database.js');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;

async function getOrderNumber(){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('setting').findOne({},(err,result)=>{
                if(err){
                    rej(err);
                }
                else{
                    var num = ++result['orderNumber'];
                    db.collection('setting').updateOne({},{$set:{orderNumber:num}},(err,result)=>{
                        if(err)
                            rej(err);
                        else
                            res(num)
                    });
                }
            });
        });
        
    }catch(err){
        throw(dbConnectionError);
    }
}

async function getSetting(){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('setting').findOne({},(err,result)=>{
                if(err)
                    rej(err);
                else{
                    delete result['_id'];
                    delete result['orderNumber'];
                    res(result);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function updateOrderTime(newTime){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('setting').updateOne({},{$set:{orderTime:newTime}},(err,result)=>{
                if(err)
                    rej(err);
                else   
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function checkCanOrder(){
    try{
        var data = await getSetting();
        var now = new Date();
        var day = now.getDay();
        var min = now.getMinutes();
        var hr = now.getHours();
        var nowStr = hr + ':' + min;
        var orderTime = data['orderTime'][day];
        if(nowStr < orderTime['begin'] || nowStr > orderTime['end'])
            return false;
        else
            return true;        
    }catch(err){
        throw(dbConnectionError);
    }
}

module.exports.getOrderNumber = getOrderNumber;
module.exports.getSetting = getSetting;
module.exports.updateOrderTime = updateOrderTime;
module.exports.checkCanOrder = checkCanOrder;