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

This filter can then be scanned by the other user's client to determine
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE2MzAzNzMyNCwtODg3OTM1MDUzXX0=
-->