/* 

I built this login form to block the front end of most of my freelance wordpress projects during the development stage. 

This is just the HTML / CSS of it but it uses wordpress's login system. 

Nice and Simple

*/

var loginDom = '<h1>Login</h1>' +
    '<form method="post" action="/index">' +
    '<input id="account" type="text" name="account" placeholder="Username" required="required" />' +
    '<input id="password" type="password" name="password" placeholder="Password" required="required" />' +
    '<div style=" display: inline-flex; width:  100%; ">' +
    '<button type="submit" class="btn btn-primary btn-block btn-large">Sign in</button>' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="registerPage()">Register</button>' +
    '</div>' +
    '</form>';

var registerDom = '<div class="login">' +
    '<h1>Register</h1><h4 id="note"></h4>' +
    '<form method="post" action="/createAccount">' +
    '<input id="account" type="text" name="account" placeholder="Username" required="required">' +
    '<input id="password" type="password" name="password" placeholder="Password" required="required">' +
    '<input id="username" type="text" name="username" placeholder="Username" required="required">' +
    '<input placeholder="Birthday" class="textbox-n" type="textbox-n" onfocus="(this.type=\'date\')" id="birth" required="required" name="birth">' +
    '<input id="gender" type="text" name="gender" placeholder="Gender" required="required"><input id="email" type="email" name="email" placeholder="Email" required="required">' +
    '<input id="phone" type="text" name="phon" placeholder="Phone" required="required">' +
    '<input id="type" type="text" name="type" placeholder="Type" required="required" style="display: none;" value="client">' +
    '<input id="image" type="text" name="image" placeholder="Image" required="required" onfocus="(this.type=\'file\')">' +
    '<div style=" display: inline-flex;width:  100%;">' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="register()">Register</button>' +
    '<button type="button" class="btn btn-primary btn-block btn-large" onclick="(window.location = \'/login\')">Back</button></div></form>' +
    '</div>';

function registerPage()
{
    document.getElementById('body').innerHTML = registerDom;
}

function register()
{
    var account = $('#account').val();
    var password = $('#password').val();
    var username = $('#username').val();
    var birth = $('#birth').val();
    var gender = $('#gender').val();
    var phone = $('#phone').val();
    var type = $('#type').val();
    var image = $('#image').val();
    if(account==''||password==''||username==''||gender==''||phone==''||type==''||image==''||birth=='')
    {
        document.getElementById('note').innerHTML = 'Please fill up all form!!';
        return;
    }
    var formData = new FormData($('form')[0]);
    $.ajax({
        url: "/createAccount",
        type: 'POST',
        data: formData,
        success: function (data) {
            document.getElementById('note').innerHTML = data;
        },
        err: function(e)
        {
            document.getElementById('note').innerHTML = 'Some errors occur!!';
        },
        cache: false,
        contentType: false,
        processData: false
    });
}