//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./TodoListBase.sol";
import "./TodoListNFT.sol";

contract TodoAchievements is TodoListBase, TodoListNFT {
    event NewAchievementNFT(
        address indexed _creator,
        uint _nftId,
        string _achievementKey
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

    struct AchievementState {
        uint createOneTodo;
        uint completeOneTodo;
        uint deleteOneTodo;
        uint createTenTodos;
        uint completeTenTodos;
        uint deleteTenTodos;
        uint createHundreedTodos;
        uint completeHundreedTodos;
        uint deleteHundreedTodos;
        uint createThousandTodos;
        uint completeThousandTodos;
        uint deleteThousandTodos;
    }

    struct Achievement {
        string name;
        string description;
        string image;
        AchievementActionType actionType;
        AchievementUnlockAmount amountToUnlock;
    }

    mapping(address => AchievementState) private _userToAchievements;

    function _getAchievements() private pure returns (Achievement[] memory) {
        Achievement[] memory achievements = new Achievement[](12);

        achievements[0] = Achievement(
            "My first todo",
            "Create 1 todo.",
            "https://arweave.net/4NJyssuUlZceoqtknyU5VEK3wMqgTbZWciZevN9D9GM",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.ONE
        );
        achievements[1] = Achievement(
            "I did it!",
            "Complete 1 todo.",
            "https://arweave.net/uWhzJiQZpcuoScvmXVgbLt7447oH1Ez0QMV_QPJC-wg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.ONE
        );
        achievements[2] = Achievement(
            "Delete me!",
            "Delete 1 todo.",
            "https://arweave.net/WUd1Xy3ZHtZ_7FI7NdZmGnWbQLUHYolMJOk7TmMT_jU",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.ONE
        );
        achievements[3] = Achievement(
            "TODO Beginner",
            "Create 10 todos.",
            "https://arweave.net/xX6VJn9_eXcJQ1irmu9aJrdLmiGzATDuxkq0EmmM07g",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.TEN
        );
        achievements[4] = Achievement(
            "10/10",
            "Complete 10 todos.",
            "https://arweave.net/-qIssbua3Y3nnB3wxQV62voJJ8jpM17N2qVAJbiAxfg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.TEN
        );
        achievements[5] = Achievement(
            "Why you create us?",
            "Delete 10 todos.",
            "https://arweave.net/fvLF8qVLqK1FVMK3GHOFw6AVIgB_mpxuQXLteLc_f-4",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.TEN
        );
        achievements[6] = Achievement(
            "TODO Master",
            "Create 100 todos.",
            "https://arweave.net/TWg6ET5F6ej8w0eP2TLRo_PmVTbX0qIV_2bMnnLV5cE",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.HUNDREED
        );
        achievements[7] = Achievement(
            "Big deal!",
            "Complete 100 todos.",
            "https://arweave.net/aMCyt9EM5M4y3lOrJY6_sLk16byqotoyYAifELm1kRg",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.HUNDREED
        );
        achievements[8] = Achievement(
            "TODO destroyer",
            "Delete 100 todos.",
            "https://arweave.net/2Y7-bswHcsmzPN02_j6V0TJEXbGlc585Ox4dhsLVU00",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.HUNDREED
        );
        achievements[9] = Achievement(
            "TODO Legend",
            "Create 1000 todos.",
            "https://arweave.net/zLClzKG7RblXAhpVAZ1495u-GjuF52YKepcpcpzgQXo",
            AchievementActionType.CREATE,
            AchievementUnlockAmount.THOUSAND
        );
        achievements[10] = Achievement(
            "Nothing is impossible",
            "Complete 1000 todos.",
            "https://arweave.net/Af-yxJvKdA4mWvnjUqmlbhQDkch3lwiPEpNnvq1WwOU",
            AchievementActionType.COMPLETE,
            AchievementUnlockAmount.THOUSAND
        );
        achievements[11] = Achievement(
            "TODO Annihilator",
            "Delete 1000 todos.",
            "https://arweave.net/Oar9c_jn_Tj8kArVCJ9nnUHvlDNql0UjPDzgDA4pXA8",
            AchievementActionType.DELETE,
            AchievementUnlockAmount.THOUSAND
        );

        return achievements;
    }

    function mintAchievementNFT(MintAchievementNFTArgs memory _params) public {
        Stats memory stats = _userToStats[msg.sender];

        AchievementState storage achievementState = _userToAchievements[
            msg.sender
        ];

        Achievement[] memory achievements = _getAchievements();

        Achievement memory achievement;

        if (_params.actionType == AchievementActionType.CREATE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(
                    stats.created >= 1 && achievementState.createOneTodo == 0,
                    "Create more todos to unlock this achievement"
                );
                achievement = achievements[0];
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.created >= 10 && achievementState.createTenTodos == 0,
                    "Create more todos to unlock this achievement"
                );
                achievement = achievements[3];
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.created >= 100 &&
                        achievementState.createHundreedTodos == 0,
                    "Create more todos to unlock this achievement"
                );
                achievement = achievements[6];
            } else {
                require(
                    stats.created >= 1000 &&
                        achievementState.createThousandTodos == 0,
                    "Create more todos to unlock this achievement"
                );
                achievement = achievements[9];
            }
        } else if (_params.actionType == AchievementActionType.COMPLETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(
                    stats.completed >= 1 &&
                        achievementState.completeOneTodo == 0,
                    "Complete more todos to unlock this achievement"
                );
                achievement = achievements[1];
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.completed >= 10 &&
                        achievementState.completeTenTodos == 0,
                    "Complete more todos to unlock this achievement"
                );
                achievement = achievements[4];
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.completed >= 100 &&
                        achievementState.createHundreedTodos == 0,
                    "Complete more todos to unlock this achievement"
                );
                achievement = achievements[7];
            } else {
                require(
                    stats.completed >= 1000 &&
                        achievementState.completeThousandTodos == 0,
                    "Complete more todos to unlock this achievement"
                );
                achievement = achievements[10];
            }
        } else if (_params.actionType == AchievementActionType.DELETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                require(
                    stats.deleted >= 1 && achievementState.deleteOneTodo == 0,
                    "Delete more todos to unlock this achievement"
                );
                achievement = achievements[2];
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                require(
                    stats.deleted >= 10 && achievementState.deleteTenTodos == 0,
                    "Delete more todos to unlock this achievement"
                );
                achievement = achievements[5];
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                require(
                    stats.deleted >= 100 &&
                        achievementState.deleteHundreedTodos == 0,
                    "Delete more todos to unlock this achievement"
                );
                achievement = achievements[8];
            } else {
                require(
                    stats.deleted >= 1000 &&
                        achievementState.deleteThousandTodos == 0,
                    "Delete more todos to unlock this achievement"
                );
                achievement = achievements[11];
            }
        } else {
            revert("Unexpected action type");
        }

        uint nftId = todoNFT.mintNFT(
            msg.sender,
            achievement.name,
            achievement.description,
            achievement.image
        );

        string memory achievementKey;

        if (_params.actionType == AchievementActionType.CREATE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                achievementState.createOneTodo = nftId;
                achievementKey = "createOneTodo";
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                achievementState.createTenTodos = nftId;
                achievementKey = "createTenTodos";
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                achievementState.createHundreedTodos = nftId;
                achievementKey = "createHundreedTodos";
            } else {
                achievementState.createThousandTodos = nftId;
                achievementKey = "createThousandTodos";
            }
        } else if (_params.actionType == AchievementActionType.COMPLETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                achievementState.completeOneTodo = nftId;
                achievementKey = "completeOneTodo";
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                achievementState.completeTenTodos = nftId;
                achievementKey = "completeTenTodos";
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                achievementState.completeHundreedTodos = nftId;
                achievementKey = "completeHundreedTodos";
            } else {
                achievementState.completeThousandTodos = nftId;
                achievementKey = "completeThousandTodos";
            }
        } else if (_params.actionType == AchievementActionType.DELETE) {
            if (_params.amount == AchievementUnlockAmount.ONE) {
                achievementState.deleteOneTodo = nftId;
                achievementKey = "deleteOneTodo";
            } else if (_params.amount == AchievementUnlockAmount.TEN) {
                achievementState.deleteTenTodos = nftId;
                achievementKey = "deleteTenTodos";
            } else if (_params.amount == AchievementUnlockAmount.HUNDREED) {
                achievementState.deleteHundreedTodos = nftId;
                achievementKey = "deleteHundreedTodos";
            } else {
                achievementState.deleteThousandTodos = nftId;
                achievementKey = "deleteThousandTodos";
            }
        }

        emit NewAchievementNFT(msg.sender, nftId, achievementKey);
    }

    function getAchievementsState()
        public
        view
        returns (AchievementState memory)
    {
        return _userToAchievements[msg.sender];
    }
}
