(function() {
  // beware, these are dom groups, not real arrays
  // use underscore on them or turn them into an array with slice
  var groups = document.querySelectorAll(".group");
  var logos = document.querySelectorAll(".group-logo");

  // dom elements
  var recentDiv = document.getElementById("recent");
  var detailInput = document.getElementById("detail-input");
  var detailLogo = document.getElementById("detail-logo");
  var copyButton = document.getElementById("copy-button");

  // local vars for linting (and performance)
  var chrome = window.chrome;
  var _ = window._;

  // recently used emojis
  var recent = [];
  // maximum number of recents
  var MAX_RECENT = 20;

  function copyToClipboard() {
    detailInput.focus();
    document.execCommand('SelectAll');
    document.execCommand('copy');
  }

  function showDetail(name, src) {
    detailLogo.src = src;
    detailInput.value = ":" + name + ":";
  }

  function addEmojiClickListener(node) {
    node.addEventListener('click', function() {
      var item = {
        name: node.dataset.name,
        src: node.dataset.src
      };

      // save last in chrome storage
      chrome.storage.local.set({
        'last': item
      });

      // set item in recent
      recent = [item].concat(_.reject(recent, function(el) {
        return el.name === item.name;
      }));

      // remove last if number too high
      if (recent.length > MAX_RECENT) {
        recent.splice(MAX_RECENT, 1);
      }

      // persist recent
      chrome.storage.local.set({
        recent: recent
      });

      // update dom
      updateRecent();

      // show selected emoji in detail
      showDetail(item.name, item.src);
      copyToClipboard(); // TODO make this turnoffable?
    });
  }

  // TODO improve performance (always called when updated)
  function updateRecent() {
    recentDiv.innerHTML = "";
    _.each(recent, function(item) {
      var cont = document.createElement("div");
      cont.dataset.name = item.name;
      cont.dataset.src = item.src;
      var span = document.createElement("span");
      var img = document.createElement("img");
      cont.classList.add("emoji");
      span.innerHTML = item.name;
      img.src = item.src;
      cont.appendChild(img);
      cont.appendChild(span);
      addEmojiClickListener(cont);
      recentDiv.appendChild(cont);
    });
  }

  _.each(groups, function(group) {
    _.each(group.childNodes, addEmojiClickListener);
  });

  // get last used emoji from user locals and display
  chrome.storage.local.get("last", function(item) {
    if (item.last) {
      showDetail(item.last.name, item.last.src);
    }
  });

  copyButton.addEventListener("click", copyToClipboard);

  // get recents from user locals
  chrome.storage.local.get("recent", function(item) {
    recent = item.recent || recent;
    updateRecent();
  });

  var setActiveGroup = (function() {
    // show first group
    var activeGroup = groups[0];
    activeGroup.style.display = "block";
    var activeLogo = logos[0];
    activeLogo.classList.add("selected");

    return function(logo) {
      if (activeLogo !== logo) {
        logo.classList.add("selected");
        activeLogo.classList.remove("selected");
        activeLogo = logo;
        var newActive = document.getElementById(logo.dataset.group);
        activeGroup.style.display = "none";
        newActive.style.display = "block";
        activeGroup = newActive;
      }
    };
  }());

  // add click listener to logo that changes the displayed group
  _.each(logos, function(logo) {
    logo.addEventListener('click', setActiveGroup.bind(null, logo));
  });

}());
