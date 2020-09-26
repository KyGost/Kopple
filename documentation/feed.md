# Feed
Uses [JSON](https://www.json.org/).

Format:
 - post (0|>) object
	 - identity (1) ?
	 - content (1) string:markdown

## ID
How to compose the post identity?

### Abitrary autoincrement perhaps?
If autoincrement, identity must never be changed. I suppose this is the case anyway.  
What to do if user deletes last item?

### Hashing
This wouldn't work. Posts should be mutable.
<!--stackedit_data:
eyJoaXN0b3J5IjpbODY1MjIwMjU4LDE2OTk1MTAyNThdfQ==
-->