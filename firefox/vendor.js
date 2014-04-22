(function() {
  var exports = {};

  exports.getLocal = function(name, cb) {
    //chrome.storage.local.get(name, function(item) {
      //cb(item[name]);
    //});
  };

  exports.setLocal = function(item) {
    //chrome.storage.local.set(item);
  };

  window.vendor = exports;
}());
