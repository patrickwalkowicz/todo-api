var todoApp = angular.module('todoApp', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    function getTodos() {
        $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }
    getTodos();
    

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                // ====
                getTodos();
                // ====
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.onEnter = function($event) {
        console.log("key pressed");
        if ($event.keyCode === 13) {

            createTodo();
        }
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                // ===
                getTodos();
                // ===
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}