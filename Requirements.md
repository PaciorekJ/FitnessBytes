# Brief Requirements

## Add Post
1. Long-term storage shall be updated to reflect the addition of a new post.
2. The user can post images.
    - Max size: 1080x1080 pixels.
3. The user can post text.
    - Max length: 250 characters.

## Reply to Post
1. Long-term storage shall be updated to contain the reply, associating it with the original post.
2. The owner of the original post should be notified.

## Like Post
1. The post should be updated to reflect like or unlike status.
    - Liking a post is a toggle action.
2. Long-term storage shall be updated to reflect the like or unlike status.
3. The owner of the post should be notified upon the first like.

## Delete Post
1. The post should be immediately hidden from the UI before confirmation from the server.
2. Only the owner can delete the post.
3. Long-term storage shall remove the post.
4. When a post is removed, all likes should be removed from long-term storage, but replies will remain as posts on other people's pages.

## Share Post
1. The user shall be able to share posts.
2. Sharing will create a link to a website route that displays only the post in question.

## Report Post
1. The user shall be able to report posts based on criteria such as spam, abuse, or inappropriate content.
2. The reported post shall be logged in long-term storage.
3. Reports can be viewed in long-term storage.

## Add Friend
1. The user shall be able to add friends.
2. A confirmation screen shall appear upon initiating a friend request.
3. The friend should be notified of the request.
4. The friend can accept the request.
5. The friend can decline the request.
6. If declined, no action is taken; if accepted, the users become friends.

## User Notifications
1. The user shall receive notifications.
2. The user shall be able to view the notifications.

## User Messages
1. The user shall be able to send messages.
2. The user shall be able to receive messages.
3. The user shall be able to delete messages.
4. The user's message read status will be known.
5. The user can send links.
6. The user can send post images.
    - Max size: 1080x1080 pixels.
7. The user can send text messages.
    - Max length: 250 characters.

## User Groups
1. Users can create groups.
2. Users can join groups.
3. Users can create group events.
4. Groups can be public.
    - Public groups can be joined by anyone.
5. Groups can be private.
    - Private groups require permission from the owner to join.
    - Group members have full permissions, except for removing users.
    - The owner can remove users.
    - The group is still publicly visible.
6. Groups can be secret.
    - Secret groups are only joinable via an invite link.
    - Group members have full permissions, except for removing users.
    - The owner can remove users.

## User Settings
1. The user can change their avatar.
    - Max image size: 320x320 pixels.
    - Only user-uploaded images are allowed.
2. The user can change their background.
    - Max size: 1600x900 pixels.
3. The user can write a bio.
    - Max length: 500 characters.
