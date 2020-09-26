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
User can select users from follows.json
### Potential implementation
Scan user trees to find who is following user
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0Mzc0MDU2NzYsLTg4NzkzNTA1M119
-->