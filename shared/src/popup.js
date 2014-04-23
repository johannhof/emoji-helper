(function() {

  // local vars for linting (and performance)
  var _ = window._;
  var vendor = window.vendor;

  // beware, these are dom groups, not real arrays
  var groups = document.querySelectorAll(".group");
  var logos = document.querySelectorAll(".group-logo");

  // dom elements
  var recentDiv = document.getElementById("recent");
  var detailInput = document.getElementById("detail-input");
  var detailLogo = document.getElementById("detail-logo");
  var copyButton = document.getElementById("copy-button");
  var searchInput = document.getElementById("search");
  var searchContainer = document.getElementById("search-container");

  // very simple utility http get function
  function getJSON(url, cb) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        cb(request.responseText);
      }
    };
  }

  // load emojis from json
  var emojis;
  getJSON("./emojis.json", function(res) {
    // flatten and objectify emojis
    // is this efficient enough?
    emojis = _.flatten(_.map(JSON.parse(res), function(group) {
      return _.map(group, function(v, k) {
        return {
          name: k,
          src: v
        };
      });
    }));
  });

  // recently used emojis
  var recent = [];
  // maximum number of recents
  var MAX_RECENT = 20;

  // show an emoji in the bottom detail screen
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

      // save last in local storage
      vendor.setLocal({
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
      vendor.setLocal({
        recent: recent
      });

      // update dom
      updateRecent();

      // show selected emoji in detail
      showDetail(item.name, item.src);
      vendor.copyToClipboard(detailInput); // TODO make this turnoffable?
    });
  }

  function appendItem(container, item) {
    var cont = document.createElement("div");
    cont.classList.add("emoji");
    cont.dataset.name = item.name;
    cont.dataset.src = item.src;

    var img = document.createElement("img");
    img.src = item.src;
    cont.appendChild(img);

    var span = document.createElement("span");
    span.innerHTML = item.name;
    cont.appendChild(span);

    addEmojiClickListener(cont);
    container.appendChild(cont);
  }

  function updateRecent() {
    recentDiv.innerHTML = "";
    _.each(recent, appendItem.bind(null, recentDiv));
  }

  _.each(groups, function(group) {
    _.each(group.childNodes, addEmojiClickListener);
  });

  copyButton.addEventListener("click", vendor.copyToClipboard.bind(null, detailInput));

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

  // search functionality
  (function() {
    var lastVal;
    searchInput.addEventListener("keyup", function() {
      setActiveGroup(searchInput);
      var val = searchInput.value;
      // prevent flickering
      if (val !== lastVal) {
        lastVal = val;
        searchContainer.innerHTML = "";
        _.filter(emojis, function(emoji) {
          return emoji.name.indexOf(val) !== -1;
        }).forEach(appendItem.bind(null, searchContainer));
      }
    });
  }());

  // wait for plugin to be fully loaded before querying data
  window.addEventListener("load", function() {
    // get last used emoji from user locals and display
    vendor.getLocal("last", function(item) {
      if (item) {
        showDetail(item.name, item.src);
      }
    });

    // get recents from user locals
    vendor.getLocal("recent", function(rec) {
      recent = rec || recent;
      updateRecent();
    });
  }, false);

}());
