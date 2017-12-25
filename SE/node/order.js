var database = require('./database.js');

async function newOrder(order){
    try{
        var db = await database.connect();
        db.collection('order').insertOne(order,(err,result)=>{
            if(err)
                conosle.log(err);
        });
    }catch(err){
        console.log(err);
    }
}

async function orderAck(order){
    try{
        var db = await database.connect();
        db.collection('order').updateOne({orderNumber:order['orderNumber']},{$set:order},(err,result)=>{
            if(err)
                console.log(err);
        });
    }catch(err){
        console.log(err);
    }
}

async function orderComplete(order){
    try{
        var db = await database.connect();
        db.collection('order').updateOne({orderNumber:order['orderNumber']},{$set:order},(err,result)=>{
            if(err)
                console.log(err);
        });
    }catch(err){
        
    }
}

async function orderEnd(order){
    try{
        var db = await database.connect();
        db.collection('order').updateOne({orderNumber:order['orderNumber']},{$set:order},(err,result)=>{
            if(err)
                console.log(err);
        });
    }catch(err){
        
    }
}

module.exports.newOrder = newOrder;
module.exports.orderAck = orderAck;
module.exports.orderComplete = orderComplete;
module.exports.orderEnd = orderEnd;