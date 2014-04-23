window.addEventListener("copy", function(event) {
  self.port.emit("copy", event.detail);
}, false);

window.addEventListener("set", function(event) {
  self.port.emit("set", event.detail);
}, false);

window.addEventListener("get", function(event) {
  self.port.emit("get", event.detail);
}, false);

self.port.on("send", function (data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent("send_" + data.key, true, true, data.value);
  document.documentElement.dispatchEvent(event);
});
