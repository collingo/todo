var glob = require('glob');

module.exports = {
  toPath: function () {
    var args = Array.prototype.slice.call(arguments);

    return args.join('/');
  },
  getAllAppComponentNames: function (callback) {
    glob("src/components/**/view.jsx", function (er, files) {
      callback(files.map(function (path) {
        return path.split('/')[2];
      }));
    });
  },
  getAllAppComponentSandboxNames: function (callback) {
    glob("src/components/**/sandbox.jsx", function (er, files) {
      callback(files.map(function (path) {
        return path.split('/')[2];
      }));
    });
  }
};
