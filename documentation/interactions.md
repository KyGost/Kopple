# Interactions
Uses [JSON](https://www.json.org/).

Format:
 - interaction (0|>) object
	 - address (1) [address](address.md)
	 - postIdentity (1) ?
	 - type (1) string:option
	 - posted (1) integer:time
	 - content (1) string

## Types
### React
Shows up on post if poster finds interaction
### Repost
Reposts, can be picked up as a feed item, depending on client settings
### Reply
Reply to post, shows up under post if poster finds interaction
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTcyOTM1MDk5NF19
-->
