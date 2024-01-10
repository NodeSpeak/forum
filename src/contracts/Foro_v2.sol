// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Foro {
    address public owner;

    struct Post {
        address user;  
        string content;
        string imageUrl;
        bool isActive;
        string community;
        string topic;
    }

    mapping(string => mapping(string => Post[])) public communityTopics;
    Post[] public allPosts;  

    event PostDeleted(address indexed user, uint256 index);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function createPost(string memory postContent, string memory imageUrl, string memory community, string memory topic) external {
        require(bytes(postContent).length > 0, "Post content cannot be empty");

        Post memory newPost = Post({
            user: msg.sender,
            content: postContent,
            imageUrl: imageUrl,
            isActive: true,
            community: community,
            topic: topic
        });

        communityTopics[community][topic].push(newPost);
        allPosts.push(newPost);
    }

    function getCommunityTopics(string memory community, string memory topic) external view returns (Post[] memory) {
        return communityTopics[community][topic];
    }

    function deletePost(uint256 index) external onlyOwner {
        require(index < allPosts.length, "Invalid index");

        allPosts[index].isActive = false;
        emit PostDeleted(allPosts[index].user, index);
    }

    function getAllPosts() external view returns (Post[] memory) {
        return allPosts;
    }
}