
# API Routes

***All API routes require application/json***

## api/likePost

Method: **POST**

Expects:

    {
        "userID": ObjectId, 
        "postID": ObjectId
    }

Response: 

    {
        "message": "empty if there was no errors",
        "result": "0 if post was disliked, 1 if liked"
    }

Effect:

    Toggles likes on a post

# api/addPost

Method: **POST**

Expects:

    {
        "userID": ObjectId,
        "content": string,
        "username": string
    }

Response:

    {
        "message": "empty if there was no errors",
        "result": "true if the post was added successfully, false otherwise"
    }

Effect:

    Adds a new post.

# api/deletePost

Method: **DELETE**

Expects:

    {
        "postID": ObjectId
    }

Response:

    {
        "message": "empty if there was no errors",
        "result": "true if the post was deleted successfully, false otherwise"
    }

Effect:

    Deletes a post.

# api/editPost

Method: **PATCH**

Expects:

    {
        "postID": ObjectId,
        "content": string
    }

Response:

    {
        "message": "empty if there was no errors",
        "result": "true if the post was edited successfully, false otherwise"
    }

Effect:

    Edits the content of a post.

# api/postOwner

Method: **POST**

Expects:

    {
        "postID": ObjectId,
        "userID": ObjectId
    }

Response:

    {
        "message": "empty if there was no errors",
        "result": "true if the user is the owner of the post, false otherwise"
    }

Effect:

    Verifies that a user is the owner of a post.

# api/isLiked

Method: **POST**

Expects:

    {
        "postID": ObjectId,
        "userID": ObjectId
    }

Response:

    {
        "message": "empty if there was no errors",
        "result": "truthy if the post is liked by the user, falsy otherwise"
    }

Effect:

    Checks if a post is liked by a user.

# User Routes

# user/signup

Method: **POST**

Expects:

    {
        "username": string,
        "password": string
    }

Response:

    {
        "message": "Error: Username or password not present" (400),
        "message": "Error: Username or password contains space" (400),
        "message": "Error: Username already exists" (409),
        "message": "empty if successful" (201)
    }

Effect:

    Adds a new user with a hashed password.

# user/login

Method: **POST**

Expects:

    {
        "username": string,
        "password": string
    }

Response:

    {
        "message": "Error: Username or password not present" (400),
        "message": "Error: Invalid username or password" (401),
        "message": "Error: Passwords don't match" (401),
        "message": "empty if successful",
        "token": "JWT token if successful"
    }

Effect:

    Authenticates a user and returns a JWT token if successful.

# Post Routes

# post/feed/:username

Method: **GET**

Expects:

    {
        pageNumber?: string;
        numberPerPage?: string;
        sortBy?: string;
    }

Response:

    {
        "message": "Invalid Username" (400),
        "message": "Internal Server Error" (500),
        "message": "empty if successful",
        "posts": Post[],
        "username": string,
        "userID": string,
        "pageNumber": number
    }

Effect:

Retrieves posts for a user's feed based on specified sorting criteria.

# post/accountPage/:username

Method: **GET**

Expects:

    {
        pageNumber?: string;
        numberPerPage?: string;
        sortBy?: string;
    }

Response:

    {
        "message": "Invalid Username" (400),
        "message": "Internal Server Error" (500),
        "message": "empty if successful",
        "posts": Post[],
        "username": string,
        "userID": ObjectId,
        "pageNumber": number,
        "postNumber": number,
        "likesNumber": number
    }

Effect:

    Retrieves posts for a user's account page based on specified sorting criteria along with post and like counts.
