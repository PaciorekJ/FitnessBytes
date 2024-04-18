
# Chunk 5

* Patch issue where two people can have outgoing friendrequest. This can be done by preventing isFriend endpoint form not looking at the bidirectional nature of a friendRequest

* Fix AddParticipant Modal, currently will break if you add and remove participants repeatably

* Revamp home page to include a call to action and a section about Fitness Bytes, and a hero section.

# Things to Consider

* Refactor username in favor of exclusively the user's _id so username can be changed freely
* Add Change password for account management and for login page
* Fix where invalidateQueryData is used in favor of optimistic updates in particular the replies use invalidate Query Data because there nested structure cause difficulties with rerenders. Data can be set and updated but theres rendering issues that are also required to be addressed in this situation. Also, counts can be changed to setQueryData, but this has side effect and will act funny with strict mode, so this can be tackled for production purposes only.

* Add My Groups Functionality
  * Create Groups
  * Edit Groups
  * Group privacy (public, private, secret)
  * Join groups
  * Leave Groups
  * Groups have -> Names, participants, events
  * This is a large feature and may be added in the future if the website gains traction and users want it.
