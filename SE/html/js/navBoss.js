var usersInfo = {};

var str = 
'        <div class="container">'+
'            <!-- Brand and toggle get grouped for better mobile display -->'+
'            <div class="navbar-header">'+
'                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">'+
'                    <span class="sr-only">Toggle navigation</span>'+
'                    <span class="icon-bar"></span>'+
'                    <span class="icon-bar"></span>'+
'                    <span class="icon-bar"></span>'+
'                </button>'+
'                <a class="navbar-brand" href="/index?m=boMenu">BFS</a>'+
'            </div>'+
'            <!-- Collect the nav links, forms, and other content for toggling -->'+
'            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
'				<ul class="nav navbar-nav navbar-right">'+
'                    <!--li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-log-in"></span> Log in</a></li>'+
'                    <li><a data-toggle="tab" href="#">Log out</a></li>'+
'                    <li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-user"></span> Boss</a></li-->'+
'					<li class="dropdown">'+
'						<a class="dropdown-toggle" data-toggle="dropdown" href="#" style = "padding-top:5px;padding-bottom:5px;">'+
'						<img id="img" style="width: 40px; height: 40px;" src="/userImage/boss.jpg">'+
'							Boss'+
'							<span class="caret"></span>'+
'						</a>'+
'						<ul class="dropdown-menu">'+
'                           <li><a href="/index?m=boSetting">'+
'								<span class="glyphicon glyphicon glyphicon-cog"></span>'+
'								Setting'+
'							</a></li>'+
'							<li><a href="/logout">'+
'								<span class="glyphicon glyphicon-log-out"></span>'+
'								Logout'+
'							</a></li>'+
'						</ul>'+
'					</li>'+
'				</ul>'+
'                <ul class="nav navbar-nav">'+
'                    <li>'+
'                        <a href="/index?m=boList">Order List</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boMenu">Menu</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boMenuList">Meal Inventory</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boHistory">History</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boAnalyze">Analyze</a>'+
'                    </li>'+
'                </ul>'+
'            </div>'+
'            <!-- /.navbar-collapse -->'+
'        </div>'+
'        <!-- /.container -->';
function navinit(){
	document.getElementById("nav").innerHTML = str;
    $.ajax({
        url: "/getAllUserInfo",
        type: "get",
        success: function(data)
        {
            //usersInfo = data;
            for(var one of data)
                userInfo[one.account] = one;
        }
    });
}

function userInfo()
{
    var classname = document.getElementsByClassName("spe01A");
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', function(){
            //console.log(this);
            var table = buildTable(userInfo[this.innerText]);
            table.style = "margin: 0 auto;";
            swal({title:this.innerText,content:table,icon:userInfo[this.innerText].image});
        }, false);
    }
}

function buildTable(a) {
    var e = document.createElement("table"), d, b;
    if (isArray(a))
        return buildArray(a);
    for (var c in a)
    {
        if(c == 'image')
            continue;
        "object" != typeof a[c] || isArray(a[c]) ? "object" == typeof a[c] && isArray(a[c]) ? (d = e.insertRow(-1),
        b = d.insertCell(-1),
        b.colSpan = 2,
        b.innerHTML = '<div>' + encodeText(c) + '</div><table style="width:100%">' + $(buildArray(a[c]), !1).html() + "</table>") : (d = e.insertRow(-1),
        b = d.insertCell(-1),
        b.innerHTML = "<div>" + encodeText(c) + "</div>",
        d = d.insertCell(-1),
        d.innerHTML = "<div>" + encodeText(a[c]) + "</div>") : (d = e.insertRow(-1),
        b = d.insertCell(-1),
        b.colSpan = 2,
        b.innerHTML = '<div>' + encodeText(c) + '</div><table style="width:100%">' + $(buildTable(a[c]), !1).html() + "</table>");
    }
    return e
}

function isArray(a) {
    return "[object Array]" === Object.prototype.toString.call(a)
}

function encodeText(a) {
    return $("<div />").text(a).html()
}

window.addEventListener("load",navinit,false);