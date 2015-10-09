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
app.get('/todos', function(req, res) {
	res.json(todos);
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
		res.status(400).json({"error": "No todo found with requested ID"});
	}
	
})


// Port setup
app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
})