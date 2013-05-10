
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var captcha = require('captcha');

var app = express();
app =express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('mysecret'));
app.use(express.session({secrect:'mysession'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(captcha({ url: '/captcha.jpg', color:'#0064cd', background: 'rgb(120,100,200)' })); // captcha params



// development only
if ('development' == app.get('env')) {
	console.log(app.get('env'));
	console.log(process.env);
  	app.use(express.errorHandler());
  	// var fs = require('fs');
  	// // 監測文件改動
   //  fs.watch(__dirname, function(event, filename) {
   //  	if(filename.substr(-4,4)=='.log')
   //  	{
   //  		return false;
   //  	}
   //      console.log(filename);
   //  });
}

app.get('/', routes.index);
app.post('/', routes.index);
app.get('/logout', routes.logout);
app.get('/users/add', user.add);
app.post('/users/add', user.add);
app.get('/users/list', user.list);
app.post('/users/del', user.del);
app.get('/users/pwd', user.pwd);
app.post('/users/pwd', user.pwd);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
