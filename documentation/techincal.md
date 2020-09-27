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
|Description|Tag|ID|Classes|
|:-:|:-:|:-:|:-:|
|Text Area|textarea|feedNewPostText|`new`,`newPost`|

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk1MDgyMzE0OV19
-->