var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

/**
 * requireChildren
 * `require`s a directory's children that are files into a `children` object,
 * names each key in `children` the filename of the required file without its
 * extension, set to the casing configured by the `options.casing` parameter.
 * Note: requireChildren uses the `destinationModule` parameter to construct a relative 
 * path with which to require the child module.
 *
 * @param <String> directory
 * @param <Object (NodeJS Module)> destinationModule
 * @param <Object> options
 *  - casing <String> ('lowercase', 'uppercase', 'capitalized')
 *
 * @returns <Object> children
 */
module.exports = function requireChildren(directory, destinationModule, options) {
  var directoryContents = fs.readdirSync(directory),
      options = options || {},
      children = {},
      childKeyCasingFunction;

  /**
   * Set child key casing function to case child keys 
   * as configured by (case-insensitive) `options.casing` parameter
   */
  options.casing = options.casing || 'lowercase',
  options.casing = lowercaseString(options.casing);

  switch (options.casing) {
    case "uppercase":
      childKeyCasingFunction = uppercaseString;
      break;
    case "capitalized":
      childKeyCasingFunction = capitalizeString;
      break;
    default:
      childKeyCasingFunction = lowercaseString;
      break;
  }

  /**
   * Require directory contents into `children` object
   */
  _.each(directoryContents, function requireChild(directoryChild) {
    var childName = getFileNameWithoutExtension(directoryChild),
        originModuleDirectoryPath = path.dirname(destinationModule.filename),
        childModulePath = path.resolve(originModuleDirectoryPath, directory, directoryChild),
        childKey = childKeyCasingFunction(childName);
    
    try {
      children[childKey] = require(childModulePath);
    } catch (error) {
      console.error('Error loading child module at path %s. Error:', childModulePath, error);
    }
  });

  return children;
};

function getFileExtension(fileName) {
  var fileExtension = path.extname(fileName);

  return fileExtension;
};

function getFileNameWithoutExtension(fileName) {
  var fileExtension = getFileExtension(fileName),
      fileExtensionExpression = new RegExp(fileExtension, 'g'),
      fileNameWithoutExtension = fileName.replace(fileExtensionExpression, '');

  return fileNameWithoutExtension;
};

function lowercaseString(string) {
  var lowercasedString = string.toLowerCase();

  return lowercasedString;
};

function uppercaseString(string) {
  var uppercasedString = string.toUpperCase();

  return uppercasedString;
};

function capitalizeString(string) {
  var stringWords = string.split(' '),
      capitalizedString = _.map(stringWords, function capitalizeWord(word) {
        var wordArray = word.split(''),
            capitalizeWord;

        wordArray[0] = uppercaseString(wordArray[0]);
        capitalizeWord = wordArray.join('');

        return capitalizedWord;
      }).join('');

  return capitalizedString;
};

