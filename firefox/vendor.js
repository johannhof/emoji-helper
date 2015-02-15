(function() {
  var exports = {};

  function send(name, data){
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, data);
    document.documentElement.dispatchEvent(event);
  }

  exports.getLocal = function(name, cb) {
    send("get", name);

    var listener = function(event) {
      if (event.detail) {
        cb(JSON.parse(event.detail));
      } else {
        cb();
      }
      window.removeEventListener("send_" + name, listener);
    };

    // suffix data name to have unique recepients
    window.addEventListener("send_" + name, listener, false);
  };

  exports.setLocal = function(key, value) {
    send("set", {key: key, value: value});
  };

  exports.copyToClipboard = function(domElement) {
    if(domElement){
      domElement.focus();
      domElement.select();
      send("copy", domElement.value);
    }
  };

  exports.insertToActive = function (text) {
    send("insert", text);
  };

  };

  window.vendor = exports;
}());
