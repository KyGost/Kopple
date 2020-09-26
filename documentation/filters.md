# Filters
Uses [JSON](https://www.json.org/).

Format:
 - filter (0|>) object
	 - name (1) string
	 - addresses (1) array:[address](address.md)

## Usage
A filter is used to determine the target audience.  
The user can use the client to create a filter and assign users whom are the intended audience.
### Implementation by default
User can select users from [follows](follows.md).
### Potential implementation
Scan user trees to find who is following user, use this for selection list.

This filter can then be scanned by the other user's client to determine that the post should or should not be shown.  
If a post has no filter, assume that user is part of intended audience.  
If post has a filter and user is in any listed filter, assume that user is part of intended audience.  
If post has a filter but user is **not** in any listed filter, assume that user is **not** part of intended audience.  

### Notes
Perhaps users can have an UnFilter. UnFilter will prevent them from seeing posts from user if it is filtered with `filter` even if they are included in said filter.
<!--stackedit_data:
eyJoaXN0b3J5IjpbODQ5NTY1MTkxLC04ODc5MzUwNTNdfQ==
-->