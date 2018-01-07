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
            db.collection('order').find({status:'done',beginTime:{$gte:beginTime},endTime:{$lte:endTime}},
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

module.exports.mealAnalyze = mealAnalyze;