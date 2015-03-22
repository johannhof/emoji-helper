// this content script serves as the bridge between the embedded page script
// and the plugin main script, routing low-level requests like copy to clipboard
// back and forth

// TODO make more DRY

window.addEventListener("combo", function(event) {
  self.port.emit("combo", event.detail);
}, false);

window.addEventListener("insert", function(event) {
  self.port.emit("insert", event.detail);
}, false);

window.addEventListener("copy", function(event) {
  self.port.emit("copy", event.detail);
}, false);

window.addEventListener("set", function(event) {
  self.port.emit("set", event.detail);
}, false);

window.addEventListener("get", function(event) {
  self.port.emit("get", event.detail);
}, false);

self.port.on("send", function(data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent("send_" + data.key, true, true,
                        JSON.stringify(data.value));
  document.documentElement.dispatchEvent(event);
});
