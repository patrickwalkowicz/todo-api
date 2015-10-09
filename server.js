var express = require('express');
var bodyParser = require('body-parser');

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
	var matchTodo;
	todos.forEach(function(todo) {
		if(todo.id === todoId) {
			matchTodo = todo;
		}
	});

	if (matchTodo){
		res.json(matchTodo)
	} else {
		res.status(404).send();
	}
});

// Respond to POST
app.post('/todos', function(req, res) {
	var body = req.body;
	body.id = todoNextId;
	todoNextId++;
	todos.push(body);
	res.json(body);
});

// Port setup
app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
})