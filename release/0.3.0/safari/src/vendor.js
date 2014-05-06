(function() {
  var exports = {};

  exports.getLocal = function(name, cb) {
    cb(JSON.parse(localStorage[name]));
  };

  exports.setLocal = function(key, value) {
    localStorage[key] = JSON.stringify(value);
  };

  exports.copyToClipboard = function(domElement) {
    domElement.focus();
    document.execCommand('SelectAll');
    // copy to clipboard not supported in safari :(
    //document.execCommand('copy');
  };

  window.vendor = exports;
}());
