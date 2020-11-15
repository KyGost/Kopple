# Kopple uses Markdown for posts
Specifically Commonmark
Markdown-It is the renderer
With plugins:
- highlight.js
  - For highlighting codes
- markdown-it-container
  - For spoilers

## How to use markdown
|To make|Use|Or|Notes|
|:-:|:-:|:-:|:-:|
|*Italic*|`*Italic*`|`_Italic_`|
|**Bold**|`**Bold**`|`__Bold__`|
|# Heading 1|`# Heading 1`||Exampled|
|## Heading 2|`## Heading 2`||Exampled|
|### Heading 3|`### Heading 3`||Exampled|
|[Title](address)|`[Title](address)`||(Link)|
|![Alt Text](address)|`![Alt Text](address)`||(Image)|
|> Quote|`> Quote`||Exampled|
|- List item|`- List item`|`* List item`|Exampled|
|1. Numbered list item|`1. Numbered list item`|`1) Numbered list item`|Exampled|
|(Horizontal Rule)|`---`|`***`|Exampled|
|`Inline code`|`` `Inline code` ``|||
|(Block code)|(See below)||Exampled|

### Examples for items which can't be rendered in a table

# Heading 1

## Heading 2

### Heading 3

> Quote

- List item

1. Numbered list item

Horizontal Rule:

---

```
Block code
```

### Block code: Further
Writing block code:
````
```[script type]
Block code
```
````

Highlighted script example:  
(This may not be highlighted for you)
```js
console.log('test')
```

# WIP!