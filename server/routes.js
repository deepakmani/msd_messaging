
// Require SendDirectMessage Controller
var DirectMessagesController = require("./controllers/directMessagesController.js")();

var db 						 = require("./models/db.js");
console.log("Ne")
module.exports = function(app) {

	/*
		@name: default route
		@descr: Load the React App
	*/

	app.get("/", function(req, res) { 

		res.render("index.html");
	});

	/* 
		@name:  	Get list of users
		@descr: 	Send all the users ordered by name
	*/

	app.get("/api/getUsers", function(req, res) {
		
		// Use find all
		db["User"].findAll()
		.then((users) => {

			// Send Users for company
			res.send(users);
		})
		.catch((err) => {
			res.send([]);
		});

	});

	/*
		@name: getUsersAndDirectMessagesCount
		@descr: Route for getting users and the direct message count
	*/
	app.get("/api/getDirectMessagesCountForUser", DirectMessagesController.getDirectMessagesCountForUser);


	/*
		@name: sendDirectMessage
		@descr: Route for sending a direct message
	*/
	app.post("/api/sendDirectMessage", DirectMessagesController.sendDirectMessage);

	/*
		@name: getDirectMessages
		@descr: Route for messages
	*/
	app.get("/api/getDirectMessages", DirectMessagesController.getDirectMessages);

	
	/*
		@name: getDirectMessages
		@descr: Route for messages
	*/
	app.get("/api/markMessagesAsRead", DirectMessagesController.markMessagesAsRead);


}		