/*
 @name:  DirectMessagesCountByUser
 @descr: Display Users and count of the number of messages to the current user
 @input: username
 		 company
 @output: Name, Username, Profile Image URL, New Message Count, Online Status
          ORDER BY most recent message


*/
var db 						 = require("../models/db.js");


module.exports = function() {

	var DirectMessagesController = {	
		
	getDirectMessagesCountForUser: function(req, res) {

		let username = req.query.username;
		let company  = req.query.company;

		db.sequelize.query("SELECT \"Users_Msg_Count\".name, \"Users_Msg_Count\".username, \"Users_Msg_Count\".profile_img_url, \"Users_Msg_Count\".new_msg_count \
		  FROM ( \"Users\" \
		   LEFT OUTER JOIN \
		(\
			SELECT sender_username, Count(*) as \"new_msg_count\" \
			FROM  \"DirectMessages\" \
			WHERE \"DirectMessages\".receiver_username ='"  + username + "\' AND \"DirectMessages\".read = false \
			GROUP BY sender_username \
		)  as \"Msg_Count\" \
		ON \"Msg_Count\".sender_username = \"Users\".username \) as \"Users_Msg_Count\" \
		WHERE \"Users_Msg_Count\".company =\'" + company + "\' AND \"Users_Msg_Count\".username != \'" + username + "\'"
		 , { type: db.sequelize.QueryTypes.SELECT})
				  		.then((users_msg_count) => {
				  			res.json(users_msg_count);
				  		})
				  		.catch((err) => {
				  			res.json([]);
				  		})
		},
		
	/*
	@name: sendDirectMessage
	@input: message to be saved to directmessages
	@descr: save the message to the datbase and send a status
			then push the message to the receiver using WebSockets
	*/		

	sendDirectMessage: function(req, res) {

		var direct_message = req.body.direct_message;

		db["DirectMessage"].create(direct_message)
		.then((direct_message) => {
				if(direct_message) {
					res.send({sent: true, id: direct_message.id, createdAt: direct_message.createdAt})
				}
		})
		.catch((err) => {
			res.send({sent: false})
		});	

	},

	/*
	@name: getDirectMessages
	@input: User1, User2 
	@descr: save the message to the datbase and send a status
			then push the message to the receiver using WebSockets
	*/
	getDirectMessages: function(req, res) {
		let username1 = req.query.username1;
		let username2  = req.query.username2;

		db.sequelize.query("SELECT * \
							FROM \"DirectMessages\" \
							WHERE (receiver_username = \'" + username1 + "\' AND sender_username = \'" + username2 + "\') \
								OR (receiver_username = \'" + username2 + "\' AND sender_username = \'" + username1 + "\') \
								"
						, { type: db.sequelize.QueryTypes.SELECT})
				  		.then((direct_messages) => {
				  			res.json(direct_messages);
				  		})
				  		.catch((err) => {
				  			res.json([]);
				  		})

	},

	/*
		@name: markMessagesASRead
		@input: receiver_username, sender_usrname
		@descr: Set all messages as read
 	*/
 	markMessagesAsRead: function(req, res) {
 		let receiver_username	= req.query.receiver_username;

 		let sender_username 	= req.query.sender_username;

 		db.sequelize.query(" UPDATE \"DirectMessages\" " +
 							 "SET 	read=\'true\'  " + 
 							 "WHERE receiver_username=\'"+ receiver_username + "\' \
 							 AND sender_username = \'" + sender_username + "\'" 
 						)
				  		.then((data) => {
				  			res.send(data);
				  		})
				  		.catch((err) => {
				  			//
				  		})
 	}

	
}

	return DirectMessagesController;

}
