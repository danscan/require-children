var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

/**
 * requireChildren
 * `require`s a directory's children that are files into a `children` object,
 * names each key in `children` the filename of the required file without its
 * extension with any spaces removed.
 * Returns children object.
 * Note: requireChildren uses the `destinationModule` parameter to construct a relative 
 * path with which to require the child module.
 *
 * @param <String> directory
 * @param <Object (NodeJS Module)> destinationModule
 *
 * @returns <Object> children
 */
module.exports = function requireChildren(directory, destinationModule) {
  var directoryContents = fs.readdirSync(directory),
      children = {};

  /**
   * Require directory contents into `children` object
   */
  _.each(directoryContents, function requireChild(directoryChild) {
    var childName = getFileNameWithoutExtension(directoryChild),
        originModuleDirectoryPath = path.dirname(destinationModule.filename),
        childModulePath = path.resolve(originModuleDirectoryPath, directory, directoryChild),
        childKey = getFileNameKey(childName);
    
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
      fileExtensionExpression = new RegExp(fileExtension, 'gi'),
      fileNameWithoutExtension = fileName.replace(fileExtensionExpression, '');

  return fileNameWithoutExtension;
};

function getFileNameKey(fileName) {
  var spaceExpression = new RegExp(' ', 'gi'),
      fileNameWithoutExtension = getFileNameWithoutExtension(fileName),
      fileNameKey = fileNameWithoutExtension.replace(spaceExpression, '');

  return fileNameKey;
};

