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

  exports.getSettings = function (callback) {
    if(localStorage.EmojiSettings){
      callback(JSON.parse(localStorage.EmojiSettings));
    }else{
      callback();
    }
  };

  exports.setSettings = function (settings) {
    localStorage.EmojiSettings = JSON.stringify(settings);
  };

  window.vendor = exports;
}());
