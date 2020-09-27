# Client
## Preface
Child elements may inherit part of their ID, if this is the case I will say 'the appended ID component is (x)' for brevity I will say "component:(x)".

Example:
- Feed component:`feed` (does not have parents so ID: `feed`)
- New post component:`NewPost` (child of feed so ID: `feedNewPost`)
- Text Area component:`text` (child of new post so ID: `feedNewPostText`)
## Feed page
### Feed
The feed is a `div` with ID `feed` and with class `socialArea`.  
The feed contains the new post feature and feed items.

The feed's new post feature is a `div` with ID `feedNewPost` and classes `new`, `newPost`.
The new post feature contains interactive elements:
|Description|Tag|Component|Classes|
|:-:|:-:|:-:|:-:|
|Text Area|textarea|Content|-|
|Post Button|button|-|-|
|Tags|input:text|Tags|-|
|Filters|input:text|Filters|-|

# JavaScript
## Constants

## Utilities
### appendToFile
```ja
appendToFile(
	String file,
	Object object
)
```

## Functionality
### feedNewPostPost
Read as: feedNewPost: Post  
`feedNewPostPost()`  
#### Usage
Gathers values from #feedNewPost, puts them in an object and appends that object to [`feed`](feed.md), see [appendToFile](wip.md).
#### Value transformation
Gets feedNewPostID + `Content`,`Tags`,`Filters`.  
`Tags` and `Filters` are converted to arrays via [arrayFromCSV](wip.md).  
Gets nextIdentity value from [`self`](self.md).  
Gets current systime using `new Date().getTime()`.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTY3ODg3NTgwOSwtODAxMTcxNTM2LDMwOT
k5Njg4XX0=
-->