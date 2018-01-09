var oldUserData;

function init()
{    
    $.ajax({
        url: "/getUserInfo",
        type: "get",
        cache: false,
        data:{},
        success: function(data)
        {
            oldUserData = data;
            document.getElementById('birth').value = data.birth.substr(0,10);
            document.getElementById('gender').value = data.gender;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone;
            document.getElementById('username').value = data.username;
        },
    });
    $('#image').change(function(){
        var tmp = ($(this).val()).split('\\');
        tmp = tmp[tmp.length-1];
        $('#filename').html(tmp);
    });
}

function submitSetting()
{
    var oPassword = $('#oPassword').val();
    var nPassword = $('#nPassword').val();
    var nnPassword = $('#nnPassword').val();
    var username = $('#username').val();
    var birth = $('#birth').val();
    var gender = $('#gender').val();
    var phone = $('#phone').val();
    var image = $('#image').val();
    if(username==''||gender==''||phone==''||type==''||birth=='')
    {
        swal("Please fill up all form!!", '', {timer:10000,icon:"info"});
        return;
    }
    if( gender!='男' && gender!='女')
    {
        swal("性別需要是: 男 或 女", '', {timer:10000,icon:"info"});
        return;
    }
    if(!(oPassword != '' && nPassword != '' && nnPassword != '' && oPassword == oldUserData.password && nPassword == nnPassword))
    {
        document.getElementById('nnPassword').value = oldUserData.password;
    }
	//is empty or error
	if(!(oPassword != '' && nPassword != '' && nnPassword != '' && oPassword == oldUserData.password && nPassword == nnPassword))
    {
        document.getElementById('nnPassword').value = oldUserData.password;
    }
    document.getElementById('nnPassword').name = 'password';
    document.getElementById('nPassword').removeAttribute('name');
    document.getElementById('oPassword').removeAttribute('name');

    var formData = new FormData($('form')[0]);
    $.ajax({
        url: "/updateAccountInfo",
        type: 'POST',
        data: formData,
        success: function (data) {
            swal("修改成功", '', {timer:10000,icon:"success"});
            document.getElementById('nnPassword').value = '';
        },
        err: function(e)
        {
            swal("Some errors occur!!", '', {timer:10000,icon:"info"});
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function checkAgree()
{
    var check = document.getElementById('check').checked;
    if(check)
        document.getElementById('button').removeAttribute('disabled');
    else
        document.getElementById('button').disabled = true;
}

addEventListener("load",init,false);
