
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
// GET ?completed=true/false //q=
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	// Handle "completed" parameter
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	// Handle query parameter
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			if(todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) !== -1) {
				return todo;
			}	
		});
	}
	res.json(filteredTodos);
})
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchTodo = _.findWhere(todos, {id: todoId});
	if (matchTodo){
		res.json(matchTodo)
	} else {
		res.status(404).send();
	}
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
app.delete('/todos/:id', function(req, res) {
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
