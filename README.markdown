This is a simple tool that takes several node modules and combines them into a single file.

This is done by implementing a mini require/define system.

## Sample Usage

The best way to explain this is to show a sample usage.  Suppose that I have a node script (with dependencies) that I want to run in some node sandbox.  I can embed my script and all it's dependencies into a single script and then run that.

    var embedder = require('embedder');
    var runInNewContext = require('vm').runInNewContext;

    embedder({
      // Embed my direct dependency
      "protocol": require.resolve("protocol"),
      // And also it's dependency
      "msgpack-js": require.resolve("msgpack-js"),
      // And my main script
      "client": "./node_modules/client.js",
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

Note that I included my main script as a dependency and then bootstrapped it with a manual require line.  This isn't strictly required, but I find it cleaner.