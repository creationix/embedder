This is a simple tool that takes several node modules and combines them into a single file.

This is done by implementing a mini require/define system.

## Sample Usage

The best way to explain this is to show a sample usage.  Suppose that I have a node script (with dependencies) that I want to run in some node sandbox.  I can embed my script and all it's dependencies into a single script and then run that.

    var embedder = require('embedder');
    var runInNewContext = require('vm').runInNewContext;

    embedder({
      "client": "./node_modules/client.js",
      "protocol": "./node_modules/protocol.js",
      "msgpack-js": "./node_modules/msgpack-js/msgpack.js",
    }, function (err, code) {
      if (err) throw err;
      code += "\nrequire('client');\n";
      runInNewContext(code, {
        require: require,
        process: process,
        Buffer: Buffer,
        console: console
      }, "generated.js");
    });
