
// MODULE SET UP --------------------------------------
	// Server
	var express = require('express');
	var app = express();
	// Database
	var db = require('./db.js');

	var bodyParser = require('body-parser'); // Parses info from HTML POST
	var _ = require('underscore'); // Useful JS methods
	var morgan = require('morgan'); // Logs requests to console


// SERVER CONFIG ----------------------------------------

	var PORT = process.env.PORT || 8080;

	app.use(express.static(__dirname + '/public')); // Set directory for serving files
	app.use(bodyParser.json()); // Parses all JSON request made through req.body
	app.use(morgan('dev')); // Log requests to the console


// ROUTING ---------------------------------------------

// API Routes -----------------------------------------

app.get('/api/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.text = {
			$like: "%" + query.q + "%"
		}
	}

	db.Todo.findAll({where: where}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

app.get('/api/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	db.Todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.status(200).json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send(e);
	});
});

// Respond to POST
app.post('/api/todos', function(req, res) {
	var body = _.pick(req.body, 'text', 'completed');
	db.Todo.create(body).then(function(todo) {
		// calling toJSON to extract just the data 
		// excluding sequelize obj methods
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// Respond to DELETE /todos/:id
app.delete('/api/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchTodo = _.findWhere(todos, {id: todoId});
	if (matchTodo) {
		todos = _.without(todos, matchTodo);
		res.json(matchTodo);
	} else {
		res.status(400).json({"error": "No todo with requested ID found."});
	}
	
})

// Updating TODOs /todos/:id
app.put('/todos/:id', function(req, res) {
	// Request validation
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id);
	var matchTodo = _.findWhere(todos, {id: todoId});
	if(!matchTodo) {
		return res.status(404).json({"error": "No todo with requested ID found."});
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	if(body.hasOwnProperty('description') && typeof body.description === 'string' && body.description.trim().length > 0) {
		validAttributes.description = body.description
	} else if(body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	// Update TODO
	_.extend(matchTodo, validAttributes);
	res.json(matchTodo);
});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port " + PORT);
	})
});
