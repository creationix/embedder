var FS = require('fs');
// Takes a dependencies map and generates a single js file.
module.exports = function embedder(dependencies, callback) {
  var files = {};
  var isDone = false;
  var module;
  function error(err) {
    if (isDone) return;
    isDone = true;
    callback(err);
  }
  
  var left = 1;
  FS.readFile(__dirname + "/module.js", 'utf8', function (err, file) {
    if (err) return error(err);
    left--;
    module = file;
    if (left === 0) {
      finish();
    }
  });

  // Load all the dependencies in parallel
  Object.keys(dependencies).forEach(function (name) {
    left++;
    FS.readFile(dependencies[name], 'utf8', function (err, file) {
      if (isDone) return;
      if (err) return error(err);
      files[name] = file;
      left--;
      if (left === 0) {
        finish();
      }
    });
  });

  function finish() {
    var parts = [module];
    
    Object.keys(files).forEach(function (name) {
      var content = files[name];
      try {
        new Function(content);
      } catch (err) {
        err.file = dependencies[name];
        console.error("Syntax error in %s", err.file);
        return error(err);
      }
      parts.push("\ndefine('" + name + "', function (module, exports) {\n\n" + content + "\n});\n");
    });

    var code = parts.join("\n");
    // Syntax check
    try {
      new Function(code);
    } catch (err) {
      console.error("Syntax error in generated code");
      err.js = code;
      return error(err);
    }
    isDone = true;
    callback(null, code);    
  }

}

