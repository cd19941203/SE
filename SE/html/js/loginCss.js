/* 

I built this login form to block the front end of most of my freelance wordpress projects during the development stage. 

This is just the HTML / CSS of it but it uses wordpress's login system. 

Nice and Simple

*/

var loginDom = '<h1>Login</h1>' +
    '<form method="post" action="/index">' +
    '<input id="account" type="text" name="account" placeholder="Username" required autofocus/>' +
    '<input id="password" type="password" name="password" placeholder="Password" required />' +
    '<div style=" display: inline-flex; width:  100%; ">' +
    '<button type="submit" class="btn btn-primary btn-block btn-large">Sign in</button>' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="registerPage()">Register</button>' +
    '</div>' +
    '</form>';

var registerDom = '<div class="register">' +
    '<h1>Register</h1><h4 id="note"></h4>' +
    '<form method="post" action="/createAccount">' +
    '<input id="account" type="text" name="account" placeholder="Account" required autofocus>' +
    '<input id="password" type="password" name="password" placeholder="Password" required>' +
    '<input id="username" type="text" name="username" placeholder="Username" required>' +
    '<input placeholder="Birthday" class="textbox-n" type="textbox-n" onfocus="(this.type=\'date\')" id="birth" required name="birth">' +
    '<input id="gender" type="text" name="gender" placeholder="Gender (男/女)" required>'+
    '<input id="email" type="email" name="email" placeholder="Email" required>' +
    '<input id="phone" type="text" name="phone" placeholder="Phone" required>' +
    '<input id="type" type="text" name="type" placeholder="Type" required style="display: none;" value="client">' +
    '<input id="image" type="text" name="image" placeholder="Image" required onfocus="(this.type=\'file\')">' +
    '<div style=" display: inline-flex;width:  100%;">' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="register()">Register</button>' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="(window.location = \'/index\')">Back</button></div></form>' +
    '</div>';

function registerPage() {
    document.getElementById('body').innerHTML = registerDom;
}

function register() {
    var account = $('#account').val();
    var password = $('#password').val();
    var username = $('#username').val();
    var birth = $('#birth').val();
    var gender = $('#gender').val();
    var phone = $('#phone').val();
    var type = $('#type').val();
    var image = $('#image').val();
    var email = $('#email').val();

    if (email == '' || account == '' || password == '' || username == '' || gender == '' || phone == '' || type == '' || birth == '') {
        //document.getElementById('note').innerHTML = 'Please fill up all form!!';

        var str = '';
        var list = {
            "account" : "Account",
            "password" : "Password",
            "username" : "Username",
            "birth" : "Birthday",
            "gender" : "Gender",
            "email" : "Email",
            "phone" : "Phone"
        };
        for(var l in list)
        {
            if($('#' + l + '').val() == '')
                str += ', ' + list[l];
        }
        document.getElementById('note').innerHTML = 'Please fill up' + str.replace(',', '') + ' in form!!';        
        return;
    }

    if(gender != '男' && gender != '女')
    {
        document.getElementById('note').innerHTML = '性別需要是: 男 或 女';
        return;
    }
    var formData = new FormData($('form')[0]);
    $.ajax({
        url: "/createAccount",
        type: 'POST',
        data: formData,
        success: function (data) {
            document.getElementById('note').innerHTML = data;

            if (data == "success")
                setTimeout(conFirmPage, 3000);
        },
        err: function (e) {
            document.getElementById('note').innerHTML = 'Some errors occur!!';
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function conFirmPage() {
    var account = $('#account').val();
    var password = $('#password').val();

    document.getElementById('body').innerHTML = loginDom;

    $('#account').val(account);
    $('#password').val(password);
    //$("[type=submit]").click();
}
