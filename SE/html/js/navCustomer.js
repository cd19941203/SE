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
'                <a class="navbar-brand" href="#">BFS</a>'+
'            </div>'+
'            <!-- Collect the nav links, forms, and other content for toggling -->'+
'            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
'				<ul class="nav navbar-nav navbar-right">'+
/*'                    <!--li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-log-in"></span> Log in</a></li>'+
'                    <li><a data-toggle="tab" href="#">Log out</a></li>'+
'                    <li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-user"></span> Admin</a></li-->'+*/
'					<li class="dropdown">'+
'						<a class="dropdown-toggle" data-toggle="dropdown" href="#">'+
'							<span class="glyphicon glyphicon-user"></span>'+
'							Admin'+
'							<span class="caret"></span>'+
'						</a>'+
'						<ul class="dropdown-menu">'+
'							<li><a href="/index?m=cuSetting">'+
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
'                    <!--li>'+
'                        <a href="#">About</a>'+
'                    </li-->'+
'                    <li>'+
'                        <a href="/index?m=cuMenu">Menu</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=cuHistory">History</a>'+
'                    </li>'+
'                </ul>'+
'            </div>'+
'            <!-- /.navbar-collapse -->'+
'        </div>'+
'        <!-- /.container -->';
function navinit(){
    $.ajax({
        url: "/whoAmI",
        type: "get",
        success: function(user)
        {
            str = str.replace(/Admin/g,user);
            document.getElementById("nav").innerHTML = str.replace(/Admin/g,user);
             $.ajax({
                url: "/userImage/"+user+".jpg",
                type: "get",
                success: function(data)
                {
                    str = str.replace('<span class="glyphicon glyphicon-user"></span>','<img id="img" style="width: 20px; height: 20px;" src="/userImage/'+user+'.jpg">');
                    document.getElementById("nav").innerHTML = str;
                }
            });
        }
    });
	
}
window.addEventListener("load",navinit,false);