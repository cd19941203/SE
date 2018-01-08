var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'BFSntou@gmail.com',
        pass: 'sigvlkvnorbjdkvt'
    }
});


var mailOptions = {
    //寄件者
    //from: 'NTOU BFS System <BFSntou@gmail.com>',
    from: 'NTOU BFS System <bfsntou@gmail.com>',
    //收件者
    //to: '蔡欣妤 <cd19941203@yahoo.com.tw>',
    to: '蔡欣妤 <cd19941203@gmail.com>',
    //副本
    //cc: 'tapiokaACL@gmail.com',
    //密件副本
    //bcc: '00357030@ntou.edu.tw',
    //主旨
    subject: 'Hi :) ，這是 node.js 發送的測試信件', // Subject line
    //純文字
    //text: 'Hello world2', // plaintext body
    //嵌入 html 的內文
    html: '<html><head></head><body><div><img src="http://140.121.197.192:9001/BFS.jpg"></div><h2>歡迎註冊 BFS 早餐店系統<br>您的驗證碼為: 1234</h2></body></html>',
    //附件檔案
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err)
        console.log(err)
    else
        console.log(info);
});
