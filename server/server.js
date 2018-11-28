var express    		= require('express');
var app        		= express();
var morgan     		= require('morgan'); 						// For logging to console
var bodyParser 		= require('body-parser'); 					// Pull info from html POST in req.body




app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json



app.use(express.static(__dirname + '/../client/build'));                 // set the static files location /public/img will be /img for users
app.set('views', __dirname + '/../client/build');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');




app.use(bodyParser.urlencoded({
  extended: true
}));
var port = process.env.PORT || 8001;

// Require routes
require("./routes.js")(app);

// listen (start app with node server.js)
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server is running on Port", port);

}); // Express server
