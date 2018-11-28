'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
    
    // Uniquely Identifies each user
    // Primary Key
    username: {
      type:   Sequelize.STRING,
      primaryKey: true,
      allowNull:  false,
      validate:   {len: [6, 20]}
    },
    // Name: String
    // Cannot be empty
    name: {
        type: Sequelize.STRING,
        allowNull:  false
      },
    // Email Id: String
    // isEmail: true
    // 
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },  
    // Profile Img: String
    // defaultValue: Dummy image
    profile_img_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "https://i.stack.imgur.com/l60Hf.png"
    },
    // Passowrd: String
    // TBD
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "password"
    },

    // Company: String
    // Required, 
    // Default Value as defaultCompany

    company: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "defaultCompany"
    },

    // Status: "I am working, etc."
    // String
    // 
    status: {
         type: Sequelize.STRING
    },
    // Location: Chicago
    // String
    location: {
        type: Sequelize.STRING,
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};