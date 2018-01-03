var database = require('./database.js');

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
        console.log(err);
    }
}

async function getStoreSetting(){

}

module.exports.getOrderNumber = getOrderNumber;
module.exports.getStoreSetting = getStoreSetting;