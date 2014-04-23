(function() {
  var exports = {};

  exports.getLocal = function(name, cb) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent("get", true, true, name);
    document.documentElement.dispatchEvent(event);

    var listener = window.addEventListener("send", function(event) {
      alert(event.detail);
      cb(event.detail);
      window.removeEventListener(listener);
    }, false);
  };

  exports.setLocal = function(item) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent("set", true, true, item);
    document.documentElement.dispatchEvent(event);
  };

  exports.copyToClipboard = function(domElement) {
    domElement.focus();
    domElement.select();
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent("copy", true, true, domElement.value);
    document.documentElement.dispatchEvent(event);
  };

  window.vendor = exports;
}());
