var nodemailer = require('nodemailer');
var sendVerificationCodesErr = 'Sending verification codes faild.';

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'BFSntou@gmail.com',
        pass: 'sigvlkvnorbjdkvt'
    }
});

async function sendVerificationCodes(userName, mail, verificationCodes) {
    try {
        return new Promise((res, rej) => {
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
                subject: 'BFS 早餐店系統 註冊驗證碼 Hi :) ，這是 node.js 發送的測試信件', // Subject line
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
                    console.log(err)
                else
                    console.log(info);
            });
        });
    } catch (err) {
        throw (sendVerificationCodesErr);
    }
}

module.exports.sendVerificationCodes = sendVerificationCodes;
