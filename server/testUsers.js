
// DB Model
var db 						 = require("./models/db.js");

// Test users

// var users = [{ name: 		"Mary J",
// 			   username:	"maryj",
// 			   email: 		"maryj@company.com",
// 			   password: 	"default",
// 			   location: 	"london",
// 			   status: 		"Available",
// 			   profile_img_url: "https://png2.kisspng.com/sh/0e599d1d8a434bc65da32994723e5eef/L0KzQYm3V8IzN5R2kJH0aYP2gLBuTgV0baMyiOR4ZnnvdX65UME5NZpzReVyZ3j3Pcb6hgIua5Dzftd7ZX7mdX7smQBwNWZnTac9Y0C8SYjqgBUzNmY5TqUANUW0QYa6UsMyPmc9Sag7MUixgLBu/kisspng-user-profile-2018-in-sight-user-conference-expo-5b554c0997cce2.5463555115323166816218.png"
// 			  },

// 			  {
// 			  	name: 		"Arjun K",
// 			   username:	"arjunk",
// 			   email: 		"arjunk@company.com",
// 			   password: 	"default",
// 			   location: 	"india",
// 			   status: 		"Available"
// 			   },

// 			{
// 			  name: 		"Michael J",
// 			   username:	"michaelj",
// 			   email: 		"michaelj@company.com",
// 			   password: 	"default",
// 			   location: 	"india",
// 			   status: 		"Available"
// 			}
// 		]
var users = [{ name: 		"Douglas",
			   username:	"dougk",
			   email: 		"dougk@company.com",
			   password: 	"default",
			   location: 	"london",
			   status: 		"Available",
			  },

			  {
			  	name: 		"Greg C",
			   username:	"gregc",
			   email: 		"gregc@company.com",
			   password: 	"default",
			   location: 	"india",
			   status: 		"Available"
			   },

			{
			  name: 		"Anna J",
			   username:	"annaj",
			   email: 		"annaj@company.com",
			   password: 	"default",
			   location: 	"london",
			   status: 		"Available"
			}
		]

console.log("Nemam Amma Bhagavan Sharanam -- db", db);
db["User"].bulkCreate(users)
.then((data) => {
	
	console.log("Nemam Amma Bhagavan Sharanam -- users stored");
});		

			  