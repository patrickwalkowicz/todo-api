var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// Parses all JSON request made through req.body
app.use(bodyParser.json());

// Routing
app.get('/', function(req, res) {
	res.send('Todo Root');
});
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
app.post('/todos', function(req, res) {
	// Request validation
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	// Delete redundant whitespace
	body.description = body.description.trim();

	body.id = todoNextId;
	todoNextId++;
	todos.push(body);
	res.json(body);
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

// Port setup
app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
})