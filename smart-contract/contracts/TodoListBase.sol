//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./TodoToken.sol";
import "./TodoPrice.sol";

contract TodoListBase is TodoToken, TodoPrice {
    event NewTodo(
        address indexed _creator,
        uint _todoId,
        string _title,
        string _description,
        uint32 _deadline,
        uint32 _createDate
    );

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

    mapping(uint => address) private _todoToUser;

    mapping(address => Stats) internal _userToStats;

    modifier onlyOwnerOf(uint _todoId) {
        require(_todoToUser[_todoId] == msg.sender, "Todo owner error");
        _;
    }

    function createTodo(CreateTodo memory _todo) public {
        require(
            bytes(_todo.title).length > 0,
            "Cant create todo with empty title"
        );

        uint32 createDate = uint32(block.timestamp);

        todos.push(
            Todo(
                todos.length,
                _todo.title,
                _todo.description,
                _todo.deadline,
                createDate,
                0,
                false
            )
        );

        uint id = todos.length - 1;

        _userToStats[msg.sender].created++;

        _todoToUser[id] = msg.sender;

        mint(msg.sender, _createTodoReward);

        emit NewTodo(
            msg.sender,
            id,
            _todo.title,
            _todo.description,
            _todo.deadline,
            createDate
        );
    }

    function updateTodo(UpdateTodo memory _todo) public onlyOwnerOf(_todo.id) {
        Todo storage todo = todos[_todo.id];

        if (_todo.isCompleted) {
            if (todo.completeDate == 0) {
                _userToStats[msg.sender].completed++;
                mint(msg.sender, _completeTodoReward);
            }

            todo.completeDate = uint32(block.timestamp);
        }

        todo.title = _todo.title;
        todo.description = _todo.description;
        todo.deadline = _todo.deadline;
        todo.isCompleted = _todo.isCompleted;
    }

    function deleteTodo(uint _id) public onlyOwnerOf(_id) {
        burn(
            msg.sender,
            todos[_id].isCompleted
                ? _createTodoReward + _completeTodoReward
                : _createTodoReward
        );
        delete _todoToUser[_id];
        _userToStats[msg.sender].deleted++;
    }

    function getTodos() public view returns (Todo[] memory) {
        uint todosLength = _userToStats[msg.sender].created -
            _userToStats[msg.sender].deleted;

        Todo[] memory userTodos = new Todo[](todosLength);
        uint counter = 0;

        for (uint i = 0; i < todos.length; i++) {
            if (_todoToUser[i] == msg.sender) {
                userTodos[counter] = todos[i];
                counter++;
            }
        }

        return userTodos;
    }

    function getStats() public view returns (Stats memory) {
        return _userToStats[msg.sender];
    }
}
