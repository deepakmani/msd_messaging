'use strict';
module.exports = (sequelize, Sequelize) => {
 
  var DirectMessage = sequelize.define('DirectMessage', {
    // Timestamp_username(sender)
  	 id: {
       type:    Sequelize.STRING,
       allowNull:   false,
       primaryKey:  true
    },

    // Text / BitMap for future
    // minLength: 1
    // MaxLength: TBD
    message: {
       type:    Sequelize.TEXT,
       allowNull:   false,
       validate:  { len: [1, 100000]}
    },

    // Username of Sender
    sender_username: {
       type:    Sequelize.STRING,
       allowNull:   false,
       foreignKey:  true
    },

    // Username of Receiver 
    receiver_username: {
       type:    Sequelize.STRING,
       allowNull:   false,
      foreignKey:  true
    },

    // Boolean
    // Display icon to show message has been read
    read: {
      type:       Sequelize.BOOLEAN,
      allowNull:    false,
      defaultValue:   false
    },
    // Int 
    // Display any priority
    priority: {
      type:       Sequelize.INTEGER,
      defaultValue:   1
    },

     // Display date for the first message in a day
    display_date: {
      type:       Sequelize.BOOLEAN,
      allowNull:    false,
    },

   
    // Boolean
    // Indicates sender the mssage is deleted
    // Receiver is not shown
    deleted: {
      type:       Sequelize.BOOLEAN,
      allowNull:    false,
      defaultValue:   false
    },

    // Date
    // Messages are ordered by createdAt in Desc

	createdAt: {
	    allowNull: false,
	    type: Sequelize.DATE,
	    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
	},
    
    // ToDo
    // Display URL preview if any
    // urls: {
    // 	type: 		 	Sequelize.String
    // }
	  updatedAt: {
	    allowNull: false,
	    type: Sequelize.DATE
	  //  defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')

	  },
	
  	}, {});
  DirectMessage.associate = function(models) {
    // associations can be defined here
  };
  return DirectMessage;
};