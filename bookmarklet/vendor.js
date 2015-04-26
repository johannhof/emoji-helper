(function() {
  var exports = {};

  exports.getLocal = function(name, cb) {
    if (localStorage[name]) {
      cb(JSON.parse(localStorage[name]));
    } else {
      cb();
    }
  };

  exports.setLocal = function(key, value) {
    localStorage[key] = JSON.stringify(value);
  };

  exports.copyToClipboard = function(domElement) {
    domElement.focus();
    document.execCommand("SelectAll");
    // copy to clipboard not supported in the bookmarklet
    //document.execCommand('copy');
  };

  window.vendor = exports;
}());
