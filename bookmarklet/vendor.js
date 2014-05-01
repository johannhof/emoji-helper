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
    console.log("Copy to clipboard not supported in the bookmarklet. Download the extension of your choice.");
    //document.execCommand('copy');
  };

  window.vendor = exports;
}());
