var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Solve kata",
	completed: false
},
{
	id: 2,
	description: "Learn Node",
	completed: false
},
{
	id: 3,
	description: "Read a book",
	completed: true
}];

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

// Port setup
app.listen(PORT, function() {
	console.log("Express listening on port " + PORT);
})