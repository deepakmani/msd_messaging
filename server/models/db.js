var Sequelize   = require('sequelize')
var fs          = require('fs');
var path        = require('path');

var db = {
			sequelize: null
		};
var basename  = path.basename(__filename);

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  db.sequelize = new Sequelize(process.env.DATABASE_URL, {
     "dialect":"postgres",
      "ssl": true,
      "dialectOptions": {
            "ssl": true
      },
    protocol: 'postgres',
  });
} else {
  // the application is executed on the local machine
  db.sequelize = new Sequelize("postgres://sjozaiawfhzuze:9bf87606cdb15dc2da5c0c2af7447dc87c6a30ebf575f43270b88b2f69bbe850@ec2-23-21-201-12.compute-1.amazonaws.com:5432/d1mptb4759v3hh"
              , {
                 "dialect":"postgres",
                  "ssl": true,
                  "dialectOptions": {
                        "ssl": true
                  },
                protocol: 'postgres',
                pool: {
                    max: 105,
                    min: 0,
                    idle: 20000,
                    acquire: 20000
                }
              });
}

db.Sequelize = Sequelize;

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = db.sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

