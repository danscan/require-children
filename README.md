Require Children
================

Easily and safely require a directory as an object whose keys are its children's filenames (without their extensions), 
and whose values are its children as modules.

# Example

To require a directory `resources/` with children `posts.js`, `comments.js`, and `users.js`:

```javascript
var resources = requireChildren('./resources', module);

/**
 * Now all modules contained in ./resources/ are in the object:
 *
 * resources = {
 *   comments: [object Object],
 *   posts: [object Object],
 *   users: [object Object]
 * } 
 */
```

# Installation

`npm install require-children`

# Usage

`requireChildren(directory, destinationModule, options);`

`requireChildren` always returns an object.

## params
+ <String> `directory`: The directory to require children of.
+ <NodeJS Module> `destinationModule`: The module that is requiring the directory children.
+ <Object> `options`
  + <String> `casing`: The casing of the returned object's keys. Can be `lowercase`, `uppercase` or `capitalized`.

