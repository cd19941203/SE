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
'                    <!--li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-log-in"></span> Log in</a></li>'+
'                    <li><a data-toggle="tab" href="#">Log out</a></li>'+
'                    <li><a data-toggle="tab" href="#"><span class="glyphicon glyphicon-user"></span> Boss</a></li-->'+
'					<li class="dropdown">'+
'						<a class="dropdown-toggle" data-toggle="dropdown" href="#">'+
'							<span class="glyphicon glyphicon-user"></span>'+
'							Boss'+
'							<span class="caret"></span>'+
'						</a>'+
'						<ul class="dropdown-menu">'+
'							<li><a href="#">'+
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
'                        <a href="/index?m=boList">Make List</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boMenuList">Menu</a>'+
'                    </li>'+
'                    <li>'+
'                        <a href="/index?m=boHistory">History</a>'+
'                    </li>'+
'                </ul>'+
'            </div>'+
'            <!-- /.navbar-collapse -->'+
'        </div>'+
'        <!-- /.container -->';
function navinit(){
	document.getElementById("nav").innerHTML = str;
}
window.addEventListener("load",navinit,false);