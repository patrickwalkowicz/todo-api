// DB CONFIG ----------------------------------------

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

// If project is on Heroku
if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
// If running locally
} else { 
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname +'/data/dev-todo.sqlite'
});
}


var db = {};
db.Todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;