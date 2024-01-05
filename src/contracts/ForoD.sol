// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Foro {
    address public owner;
    mapping(address => Comment[]) public userComments;
    Comment[] public allComments;  

    event CommentDeleted(address indexed user, uint256 index);

    struct Comment {
        address user;  
        string content;
        string imageUrl;
        bool isActive;
        string topic;
    }
    
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function postComment(string memory comment, string memory imageUrl, string memory topic) external {
        require(bytes(comment).length > 0, "Comment cannot be empty");

        Comment memory newComment = Comment({
            user: msg.sender,
            content: comment,
            imageUrl: imageUrl,
            isActive: true,
            topic: topic
        });

        userComments[msg.sender].push(newComment);
        allComments.push(newComment);
    }

    function getComments(address user) external view returns (Comment[] memory) {
        return userComments[user];
    }

    function deleteComment(uint256 index) external onlyOwner {
        require(index < allComments.length, "Invalid index");

        allComments[index].isActive = false;
        emit CommentDeleted(allComments[index].user, index);
    }

    function getAllComments() external view returns (Comment[] memory) {
        return allComments;
    }
}