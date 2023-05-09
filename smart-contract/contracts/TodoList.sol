//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

contract TodoList {
    struct Todo {
        uint id;
        string title;
        string description;
        uint32 deadline;
        uint32 createDate;
        uint32 completeDate;
        bool isCompleted;
    }

    struct Stats {
        uint created;
        uint completed;
        uint deleted;
    }

    struct CreateTodo {
        string title;
        string description;
        uint32 deadline;
    }

    struct UpdateTodo {
        uint32 id;
        string title;
        string description;
        uint32 deadline;
        bool isCompleted;
    }

    Todo[] private todos;

    mapping(uint => address) private todoToUser;

    mapping(address => Stats) private userToStats;

    modifier onlyOwnerOf(uint _todoId) {
        require(todoToUser[_todoId] == msg.sender, "Owner error");
        _;
    }

    function createTodo(CreateTodo memory _todo) public {
        require(
            bytes(_todo.title).length > 0,
            "Cant create todo with empty title"
        );

        todos.push(
            Todo(
                todos.length,
                _todo.title,
                _todo.description,
                _todo.deadline,
                uint32(block.timestamp),
                0,
                false
            )
        );

        uint id = todos.length - 1;

        userToStats[msg.sender].created++;

        todoToUser[id] = msg.sender;
    }

    function updateTodo(UpdateTodo memory _todo) public onlyOwnerOf(_todo.id) {
        Todo storage todo = todos[_todo.id];

        if (_todo.isCompleted) {
            if (todo.completeDate == 0) {
                userToStats[msg.sender].completed++;
            }

            todo.completeDate = uint32(block.timestamp);
        }

        todo.title = _todo.title;
        todo.description = _todo.description;
        todo.deadline = _todo.deadline;
        todo.isCompleted = _todo.isCompleted;
    }

    function deleteTodo(uint _id) public onlyOwnerOf(_id) {
        delete todoToUser[_id];
        userToStats[msg.sender].deleted++;
    }

    function getTodos() public view returns (Todo[] memory) {
        uint todosLength = userToStats[msg.sender].created -
            userToStats[msg.sender].deleted;

        Todo[] memory userTodos = new Todo[](todosLength);
        uint counter = 0;

        for (uint i = 0; i < todos.length; i++) {
            if (todoToUser[i] == msg.sender) {
                userTodos[counter] = todos[i];
                counter++;
            }
        }

        return userTodos;
    }

    function getStats() public view returns (Stats memory) {
        return userToStats[msg.sender];
    }
}
