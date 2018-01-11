var database = require('./database.js');
var fs = require('fs');
var nodemailer = require('nodemailer');
var dbConnectionError = database.dbConnectionError;
var dbManipulationError = database.dbManipulationError;
var sendVerificationCodesErr = 'Sending verification codes faild.';

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'BFSntou@gmail.com',
        pass: 'sigvlkvnorbjdkvt'
    }
});
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
                    if(result && result['password'] == password){
                        if(result['validate']!=true)
                            res('notValid');
                        else
                            res(true);
                    }
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
        
async function createAccount(data,image){
    var hasImage = false;
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:data.account},(err,result)=>{
                if(result){
                    rej('account already exists');
                }
                else{
                    var code = Math.floor(Math.random()*10000).toString();
                    var len = code.length;
                    for(var i = 0;i<4-len;i++){
                        code = '0' + code;
                    }
                    data['code'] = code;
                    if(typeof image !== 'undefined'){
                        data['image'] = '/userImage/' + data.account + '.jpg';
                        hasImage = true;
                    }
                    else{
                        data['image'] = '/userImage/default.jpg';
                    }
                    if(typeof data['birth'] !== 'undefined')
                        data['birth'] = new Date(data['birth']);
                    db.collection('user').insertOne(data,(err,result)=>{
                        if(err)
                            rej(dbManipulationError);
                        else{
                            if(hasImage)
                                fs.renameSync(image.path,'../userImage/'+data.account+'.jpg');
                            sendVerificationCodes(data['username'],data['email'],code);
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

async function updateAccountInfo(acc,data,image){
    var hasImage = false;
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            if(typeof image !== 'undefined'){
                data['image'] = '/userImage/' + acc + '.jpg';
                hasImage = true;
            }
            else{
                data['image'] = '/userImage/default.jpg';
            }
            if(typeof data['birth'] !== 'undefined')
                data['birth'] = new Date(data['birth']);

            db.collection('user').updateOne({account:acc},{$set:data},(err,result)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    if(hasImage){
                        try{
                            fs.copyFileSync(image.path,'../userImage/'+acc+'.jpg');
                        }catch(err){
                            console.log(err);
                        }
                    }
                    res();
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    } 
}

async function sendVerificationCodes(userName, mail, verificationCodes) {
    try{
        var mailOptions = {
            //寄件者
            //from: 'NTOU BFS System <BFSntou@gmail.com>',
            from: 'NTOU BFS System <bfsntou@gmail.com>',
            //收件者
            //to: '蔡欣妤 <cd19941203@yahoo.com.tw>',
            to: userName + ' <' + mail + '>',
            //副本
            //cc: 'tapiokaACL@gmail.com',
            //密件副本
            //bcc: '00357030@ntou.edu.tw',
            //主旨
            subject: 'BFS 早餐店系統 註冊驗證碼', // Subject line
            //純文字
            //text: 'Hello world2', // plaintext body
            //嵌入 html 的內文
            html: '<html><head></head><body><div><img src="cid:BFS"></div><h2>歡迎註冊 BFS 早餐店系統<br>您的驗證碼為: ' + verificationCodes + '</h2></body></html>',
            //附件檔案
            attachments: [
                            {
                                filename: 'BFS.jpg',
                                path: '../mail_BFS.jpg',
                                cid: 'BFS'
                            }
                        ]
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
    } catch (err) {
        throw (sendVerificationCodesErr);
    }
}

async function emailConfirm(account,input){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:account},(err,result)=>{
                if(err) 
                    rej(dbManipulationError);
                else{
                    if(result && result['code'] == input){
                        db.collection('user').updateOne({account:account},{$set:{validate:true}},(err,result)=>{
                            if(err)
                                rej(dbManipulationError);
                            else
                                res(true);
                        });
                    }
                    else{
                        res(false);
                    }
                }
            });
        });
    }catch(err){
        throw(dbConnectionError);
    }
}

async function getNewVerificationCodes(account){
    try{
        var db = await database.connect();
        var code = Math.floor(Math.random()*10000).toString();
        var len = code.length;
        for(var i = 0;i<4-len;i++){
            code = '0' + code;
        }
        return new Promise((res,rej)=>{
            db.collection('user').findOne({account:account},(err,data)=>{
                if(err)
                    rej(dbManipulationError);
                else{
                    db.collection('user').updateOne({account:account},{$set:{code:code}},(err,result)=>{
                        if(err)
                            rej(dbManipulationError);
                        else{
                            sendVerificationCodes(data['username'],data['email'],code);
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

async function getAllUserInfo(){
    try{
        var db = await database.connect();
        return new Promise((res,rej)=>{
            db.collection('user').find({},{projection:{_id:0,password:0,validate:0,code:0}}).toArray((err,result)=>{
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

module.exports.getAccountType = getAccountType;
module.exports.createAccount = createAccount;
module.exports.login = login;
module.exports.getUserInfo =  getUserInfo;
module.exports.updateAccountInfo = updateAccountInfo;
module.exports.sendVerificationCodes = sendVerificationCodes;
module.exports.emailConfirm = emailConfirm;
module.exports.getNewVerificationCodes = getNewVerificationCodes;
module.exports.getAllUserInfo = getAllUserInfo;