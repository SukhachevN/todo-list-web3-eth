//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./TodoToken.sol";
import "./TodoNFT.sol";

contract TodoList is TodoToken {
    event NewTodo(
        address indexed creator,
        uint _todoId,
        string title,
        string description,
        uint32 deadline,
        uint32 createDate
    );

    enum AchievementActionType {
        CREATE,
        COMPLETE,
        DELETE
    }
    enum AchievementUnlockAmount {
        ONE,
        TEN,
        HUNDREED,
        THOUSAND
    }

    struct MintAchievementNFTArgs {
        AchievementActionType actionType;
        AchievementUnlockAmount amount;
    }

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

    struct AchievementState {
        bool createOneTodo;
        bool completeOneTodo;
        bool deleteOneTodo;
        bool createTenTodos;
        bool completeTenTodos;
        bool deleteTenTodos;
        bool createHundreedTodos;
        bool completeHundreedTodos;
        bool deleteHundreedTodos;
        bool createThousandTodos;
        bool completeThousandTodos;
        bool deleteThousandTodos;
    }

    struct Achievement {
        string name;
        string description;
        string image;
        AchievementActionType actionType;
        AchievementUnlockAmount amountToUnlock;
    }

    Todo[] private todos;

    TodoNFT private todoNFT;

    Achievement[] private _achievements = [
        Achievement(
            "My first todo",
            "Create 1 todo.",
            "https://arweave.net/4NJyssuUlZceoqtknyU5VEK3wMqgTbZWciZevN9D9GM",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.ONE
        ),
        Achievement(
            "I did it!",
            "Complete 1 todo.",
            "https://arweave.net/uWhzJiQZpcuoScvmXVgbLt7447oH1Ez0QMV_QPJC-wg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.ONE
        ),
        Achievement(
            "Delete me!",
            "Delete 1 todo.",
            "https://arweave.net/WUd1Xy3ZHtZ_7FI7NdZmGnWbQLUHYolMJOk7TmMT_jU",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.ONE
        ),
        Achievement(
            "TODO Beginner",
            "Create 10 todos.",
            "https://arweave.net/xX6VJn9_eXcJQ1irmu9aJrdLmiGzATDuxkq0EmmM07g",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.TEN
        ),
        Achievement(
            "10/10",
            "Complete 10 todos.",
            "https://arweave.net/-qIssbua3Y3nnB3wxQV62voJJ8jpM17N2qVAJbiAxfg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.TEN
        ),
        Achievement(
            "Why you create us?",
            "Delete 10 todos.",
            "https://arweave.net/fvLF8qVLqK1FVMK3GHOFw6AVIgB_mpxuQXLteLc_f-4",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.TEN
        ),
        Achievement(
            "TODO Master",
            "Create 100 todos.",
            "https://arweave.net/TWg6ET5F6ej8w0eP2TLRo_PmVTbX0qIV_2bMnnLV5cE",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.HUNDREED
        ),
        Achievement(
            "Big deal!",
            "Complete 100 todos.",
            "https://arweave.net/aMCyt9EM5M4y3lOrJY6_sLk16byqotoyYAifELm1kRg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.HUNDREED
        ),
        Achievement(
            "TODO destroyer",
            "Delete 100 todos.",
            "https://arweave.net/2Y7-bswHcsmzPN02_j6V0TJEXbGlc585Ox4dhsLVU00",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.HUNDREED
        ),
        Achievement(
            "TODO Legend",
            "Create 1000 todos.",
            "https://arweave.net/zLClzKG7RblXAhpVAZ1495u-GjuF52YKepcpcpzgQXo",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.THOUSAND
        ),
        Achievement(
            "Nothing is impossible",
            "Complete 1000 todos.",
            "https://arweave.net/Af-yxJvKdA4mWvnjUqmlbhQDkch3lwiPEpNnvq1WwOU",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.THOUSAND
        ),
        Achievement(
            "TODO Annihilator",
            "Delete 1000 todos.",
            "https://arweave.net/Oar9c_jn_Tj8kArVCJ9nnUHvlDNql0UjPDzgDA4pXA8",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.THOUSAND
        )
    ];

    mapping(uint => address) private _todoToUser;

    mapping(address => Stats) private _userToStats;

    mapping(address => AchievementState) private _userToAchievements;

    constructor(address todoNftAddress) {
        todoNFT = TodoNFT(todoNftAddress);
    }

    modifier onlyOwnerOf(uint _todoId) {
        require(_todoToUser[_todoId] == msg.sender, "Owner error");
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

        TodoToken.mint(msg.sender, 50);

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
                TodoToken.mint(msg.sender, 100);
            }

            todo.completeDate = uint32(block.timestamp);
        }

        todo.title = _todo.title;
        todo.description = _todo.description;
        todo.deadline = _todo.deadline;
        todo.isCompleted = _todo.isCompleted;
    }

    function deleteTodo(uint _id) public onlyOwnerOf(_id) {
        TodoToken.burn(msg.sender, todos[_id].isCompleted ? 150 : 50);
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

    function mintAchievementNFT(MintAchievementNFTArgs memory _params) public {
        Stats memory stats = _userToStats[msg.sender];

        AchievementState storage achievementState = _userToAchievements[
            msg.sender
        ];

        Achievement memory achievement;

        if (_params.actionType == AchievementActionType.CREATE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(stats.created >= 1 && !achievementState.createOneTodo);
                achievement = _achievements[0];
                achievementState.createOneTodo = true;
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.created >= 10 && !achievementState.createTenTodos
                );
                achievement = _achievements[3];
                achievementState.createTenTodos = true;
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.created >= 100 &&
                        !achievementState.createHundreedTodos
                );
                achievement = _achievements[6];
                achievementState.createOneTodo = true;
            } else {
                require(
                    stats.created >= 1000 &&
                        !achievementState.createThousandTodos
                );
                achievement = _achievements[9];
                achievementState.createThousandTodos = true;
            }
        } else if (_params.actionType == AchievementActionType.COMPLETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(
                    stats.completed >= 1 && !achievementState.completeOneTodo
                );
                achievement = _achievements[1];
                achievementState.completeOneTodo = true;
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.completed >= 10 && !achievementState.completeTenTodos
                );
                achievement = _achievements[4];
                achievementState.completeTenTodos = true;
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.completed >= 100 &&
                        !achievementState.createHundreedTodos
                );
                achievement = _achievements[7];
                achievementState.createHundreedTodos = true;
            } else {
                require(
                    stats.completed >= 1000 &&
                        !achievementState.completeThousandTodos
                );
                achievement = _achievements[10];
                achievementState.completeThousandTodos = true;
            }
        } else if (_params.actionType == AchievementActionType.DELETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(stats.deleted >= 1 && !achievementState.deleteOneTodo);
                achievement = _achievements[2];
                achievementState.deleteOneTodo = true;
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.deleted >= 10 && !achievementState.deleteTenTodos
                );
                achievement = _achievements[5];
                achievementState.deleteTenTodos = true;
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.deleted >= 100 &&
                        !achievementState.deleteHundreedTodos
                );
                achievement = _achievements[8];
                achievementState.deleteHundreedTodos = true;
            } else {
                require(
                    stats.deleted >= 1000 &&
                        !achievementState.deleteThousandTodos
                );
                achievement = _achievements[11];
                achievementState.deleteThousandTodos = true;
            }
        }

        todoNFT.mintNFT(
            msg.sender,
            achievement.name,
            achievement.description,
            achievement.image
        );
    }
}
