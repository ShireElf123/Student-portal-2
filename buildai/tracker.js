/* BuildAI Reviews — click tracker
   Posts affiliate-link clicks to the hidden Netlify "click-tracking" form so
   every /go/* outbound click is logged in Netlify Forms without any third-party
   analytics (privacy-friendly, zero extra requests, no cookies). */
(function () {
  'use strict';

  var FORM_NAME = 'click-tracking';

  function toolFromHref(href) {
    var m = href.match(/\/go\/([a-z0-9-]+)/i);
    return m ? m[1] : 'external';
  }

  function track(link) {
    var data = {
      'form-name': FORM_NAME,
      tool: link.getAttribute('data-tool') || toolFromHref(link.getAttribute('href') || ''),
      page: window.location.pathname,
      label: (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      href: link.href || '',
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct'
    };

    try {
      var body = new URLSearchParams(data);
      if (navigator.sendBeacon) {
        // Non-blocking: never delays the affiliate redirect.
        navigator.sendBeacon('/', body);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body.toString());
      }
    } catch (e) {
      /* Never break an outbound click because tracking failed. */
    }
  }

  document.addEventListener(
    'click',
    function (e) {
      var link = e.target && e.target.closest ? e.target.closest('a[href^="/go/"], a[data-track]') : null;
      if (link) track(link);
    },
    true
  );
})();
