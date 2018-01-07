var database = require('./database.js');
var meal = require('./meal.js');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;


async function mealAnalyze(beginTime,endTime){
    try{
        var menu = await meal.getMenu();
        var db = await database.connect();
        var record = {};
        return new Promise((res,rej)=>{
            db.collection('order').find({status:'done',$and:[{beginTime:{$gte:beginTime}},{beginTime:{$lte:endTime}}]},
            {projection:{_id:0,advice:0,reason:0,expectTime:0}}).toArray((err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    for(var order of result){
                        for(var meal of order['meal']){
                            if(meal['name'] in record)
                                record[meal['name']] += meal['amount'];
                            else
                                record[meal['name']] = meal['amount'];
                            
                        }
                    }
                    var arr = [];
                    for(var m in record)
                        arr.push({meal:m,amount:record[m]});
                    arr.sort((x,y)=>{
                        if(x['amount']>y['amount'])
                            return -1;
                        else if(x['amount']<y['amount'])
                            return 1;
                        else
                            return 0;
                    });
                    res(arr);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function genderAnalyze(beginTime,endTime){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            Promise.all([getGenderAccount('男'),getGenderAccount('女')]).then(values=>{
                var maleAccount = values[0];
                var femaleAccount = values[1];
                Promise.all([calculateByAccount(maleAccount,beginTime,endTime),calculateByAccount(femaleAccount,beginTime,endTime)]).then(values=>{
                    var data = {};
                    data['男'] = values[0];
                    data['女'] = values[1];
                    res(data);
                }).catch(err=>{
                    rej(err);
                });
            }).catch(err=>{
                rej(err);
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function ageAnalyze(beginTime,endTime){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('order')
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function getGenderAccount(gender){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').find({gender:gender},{projection:{_id:0,account:1}}).toArray((err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    var arr = [];
                    for(var acc of result)
                        arr.push(acc['account']);
                    res(arr);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function calculateByAccount(list,beginTime,endTime){
    try{
        var db = await database.connect();
        var record = {};
        return new Promise((res,rej)=>{
            db.collection('order').find({account:{$in:list},status:'done',$and:[{beginTime:{$gte:beginTime}},{beginTime:{$lte:endTime}}]},
            {projection:{_id:0}}).toArray((err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    for(var order of result){
                        for(var meal of order['meal']){
                            if(meal['name'] in record)
                                record[meal['name']] += meal['amount'];
                            else
                                record[meal['name']] = meal['amount'];
                            
                        }
                    }
                    var arr = [];
                    for(var m in record)
                        arr.push({meal:m,amount:record[m]});
                    arr.sort((x,y)=>{
                        if(x['amount']>y['amount'])
                            return -1;
                        else if(x['amount']<y['amount'])
                            return 1;
                        else
                            return 0;
                    });
                    res(arr);
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

module.exports.mealAnalyze = mealAnalyze;
module.exports.genderAnalyze = genderAnalyze;
module.exports.ageAnalyze = ageAnalyze;
module.exports.getGenderAccount = getGenderAccount;
module.exports.calculateByAccount = calculateByAccount;