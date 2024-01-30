
## Keep Track When user likes a post

Collection Name: PostLikes 
    PostID INT,
    UserID INT,
    PRIMARY KEY (PostID, UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)

## Keep track of Posts
Collection Name: Posts
    PostID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Username VARCHAR(50),
    Content VARCHAR(255),
    Likes INT DEFAULT 0,
    TimeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)

## Keep track of Users 
Collection Name: Users
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255)