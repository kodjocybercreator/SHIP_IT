/* surface gate - the window is checked before the rest of the page parses */
(function () {
  var OPEN = "2026-10-06T21:00:00Z";
  var CLOSE = "2026-10-07T00:00:00Z";
  var openAt = Date.parse(OPEN);
  var closeAt = Date.parse(CLOSE);

  function localOnly() {
    var host = location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]" || host === "";
  }

  function readNow() {
    var raw = null;
    if (localOnly()) {
      try {
        raw = new URLSearchParams(location.search).get("now");
      } catch (err) {
        raw = null;
      }
    }
    if (raw) {
      var parsed = Date.parse(raw);
      if (!isNaN(parsed)) return parsed;
    }
    return Date.now();
  }

  function phase() {
    var at = readNow();
    if (at < openAt) return "wait";
    if (at < closeAt) return "live";
    return "closed";
  }

  function forward() {
    location.replace("./index.html" + location.search);
  }

  if (phase() !== "live") {
    forward();
    return;
  }

  window.setInterval(function () {
    if (phase() === "closed") forward();
  }, 1000);
})();
