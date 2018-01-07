var database = require('./database.js');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;
var dataError = 'orderNumerError';
var orderStatus = {
    new:'new',
    accepted:'accepted',
    pending:'pending',
    canceled:'canceled',
    completed:'completed',
    done:'done'
};

async function getOrderData(num){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').findOne({orderNumber:num},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res(result);
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function newOrder(order){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').insertOne(order,(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function orderStatusChange(num,newStatus){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:num},{$set:{status:newStatus}},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
                    /*if(result.result.nModified == 0){
                        rej()
                    }*/
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function updateModifyAdvice(num,advice){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:num},{$set:{advice:advice}},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function changeOrder(orderData){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:orderData['orderNumber']},{$set:orderData},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function orderDone(number,date){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:number},{$set:{status:'done',endTime:date}},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function getOrderList(query){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').find(query,{projection:{_id:0}}).toArray((err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    res(result);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function updateOrder(num,newOrder){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order').updateOne({orderNumber:number},{$set:newOrder},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else
                    res();
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}


module.exports.orderStatus = orderStatus;
module.exports.dbConnectionError = dbConnectionError;
module.exports.dbManipulationError = dbManipulationError;
module.exports.getOrderData = getOrderData;
module.exports.newOrder = newOrder;
module.exports.orderStatusChange = orderStatusChange;
module.exports.updateModifyAdvice = updateModifyAdvice;
module.exports.orderDone = orderDone;
module.exports.changeOrder = changeOrder;
module.exports.getOrderList = getOrderList;
module.exports.updateOrder = updateOrder;
