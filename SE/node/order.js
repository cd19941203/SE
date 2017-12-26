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
        console.log(err);
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
        console.log(err);
    }
}

async function getNotAckOrder(){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').find({status:'new'}).toArray((err,result)=>{
                if(err)
                    rej(err);
                else
                    res(result);
            });
        });
    }catch(err){
        return {};
    }
}

module.exports.newOrder = newOrder;
module.exports.orderAck = orderAck;
module.exports.orderComplete = orderComplete;
module.exports.orderEnd = orderEnd;
module.exports.getNotAckOrder = getNotAckOrder;