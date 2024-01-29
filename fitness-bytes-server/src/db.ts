
async function addUser(username: string, password: string){
    console.log("addUser");
    return 1;
}

async function addPost(userId: number, username: string, content: string){
    console.log("addPost");
    return 1;
}

async function editPost(postID: number, content: string) {
    console.log("editPost");
    return 1;
}

async function deletePost(postID: number) {
    console.log("deletePost");
    return 1;
}

async function toggleLike(postID: number, UserID: number) {
    console.log("toggleLike");
    return 1;
}

async function isLiked(postID: number, UserID: number) {
    console.log("isLiked");
    return 1;
}


// Check Length of result if > 0 then valid
async function validateIsOwner(postID: number, userID: number) {
    console.log("validateIsOwner");
    return 1;
}

// return "" if not valid
async function getUserIDFromUsername(username: string) {
    console.log("getUserIDFromUsername");
    return 1;
}

async function getNewestPosts(numberPerPage: number, currentPageNumber: number, ownerID: number = -1) {
    console.log("getNewestPosts");
    return 1;
}

async function getLikedPosts(userID: number, numberPerPage: number, currentPageNumber: number, ownerID: number = -1) {
    console.log("getLikedPosts");
    return 1;
}

async function getMostLikedPosts(userID: number, numberPerPage: number, currentPageNumber: number, ownerID: number = -1) {
    console.log("getMostLikedPosts");
    return 1;
}

async function getPostCountByUserId(userID: number) {
    console.log("getPostCountByUserId");
    return 1;
}

async function getPostLikesByUserId(userID: number) {
    console.log("getPostLikesByUserId");
    return 1;
}

// Get password from cell and return "" if not valid
async function getPasswordFromUsername(username: string) {
    console.log("getPasswordFromUsername");
    return "password";
}

export {addUser, addPost, editPost, deletePost, getLikedPosts, getMostLikedPosts,getNewestPosts, getPasswordFromUsername,getPostCountByUserId, getPostLikesByUserId, getUserIDFromUsername, isLiked, toggleLike, validateIsOwner}