// this content script serves as the bridge between the embedded page script
// and the plugin main script, routing low-level requests like copy to clipboard
// back and forth

window.addEventListener("copy", function(event) {
  self.port.emit("copy", event.detail);
}, false);

window.addEventListener("set", function(event) {
  self.port.emit("set", event.detail);
}, false);

window.addEventListener("get", function(event) {
  self.port.emit("get", event.detail);
}, false);

window.addEventListener("setSettings", function(event) {
  self.port.emit("setSettings", event.detail);
}, false);

window.addEventListener("get", function(event) {
  self.port.emit("getSettings");
}, false);

self.port.on("sendSettings", function(data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent("sendSettings", true, true, data);
  document.documentElement.dispatchEvent(event);
});

self.port.on("send", function(data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent("send_" + data.key, true, true, data.value);
  document.documentElement.dispatchEvent(event);
});
