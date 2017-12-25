var database = require('./database.js');

async function newOrder(){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{

        });
    }catch(err){
        
    }
}

async function orderAck(){
    try{
        var db = await database.connect();
    }catch(err){
        
    }
}

async function orderComplete(){
    try{
        var db = await database.connect();
    }catch(err){
        
    }
}

async function orderEnd(){
    try{
        var db = await database.connect();
    }catch(err){
        
    }
}

module.exports.newOrder = newOrder;
module.exports.orderAck = orderAck;
module.exports.orderComplete = orderComplete;
module.exports.orderEnd = orderEnd;