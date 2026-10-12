/* AFFILIATE CLICK TRACKER
   Tracks clicks on /go/<slug> affiliate links (left AND middle click).
   Sends to: console, localStorage (type showClicks() in console),
   Netlify Forms, and Plausible / GA4 if those are installed on the page. */
(function () {
  'use strict';
  var TOOLS = { durable: 'Durable AI', dorik: 'Dorik AI', framer: 'Framer', wix: 'Wix AI', '10web': '10Web' };
  var VENDORS = { 'durable.co': 'Durable AI', 'dorik.com': 'Dorik AI', 'framer.com': 'Framer', 'wix.com': 'Wix AI', '10web.io': '10Web' };
  var PAGES = { '': 'Homepage', 'index.html': 'Homepage', 'review.html': 'Review', 'compare.html': 'Compare' };

  function pageName() {
    var p = location.pathname;
    if (p === '/' || p === '') return 'Homepage';
    var m = p.match(/^\/reviews\/([a-z0-9-]+)/i);
    if (m) return 'Review: ' + m[1];
    if (p.indexOf('/compare/') === 0) return 'Compare: ' + p.replace(/\/+$/, '').split('/').pop();
    var b = p.split('/').pop();
    return PAGES[b] || b;
  }

  function send(tool, href, label) {
    var page = pageName(), ts = new Date().toISOString();
    console.log('[Affiliate Click] ' + tool + ' | ' + page + ' | "' + label + '"');
    try {
      var log = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
      log.push({ tool: tool, page: page, label: label, href: href, ts: ts });
      localStorage.setItem('affiliate_clicks', JSON.stringify(log));
    } catch (e) {}
    try {
      if (typeof window.plausible === 'function') window.plausible('Affiliate Click', { props: { tool: tool, page: page } });
      if (typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', { tool: tool, page: page, link_text: label });
    } catch (e) {}
    try {
      var body = new URLSearchParams({ 'form-name': 'click-tracking', tool: tool, page: page, label: label,
        href: href, timestamp: ts, referrer: document.referrer || 'direct' }).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  function handler(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // middle click only
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var tool = null;
    var go = href.match(/^\/go\/([a-z0-9-]+)/i);
    if (go) {
      tool = TOOLS[go[1].toLowerCase()] || go[1];
    } else {
      // Fallback: catch direct vendor links anywhere in content
      try {
        var host = new URL(href, location.origin).hostname.replace('www.', '');
        if (VENDORS[host]) tool = VENDORS[host];
      } catch (err) { /* not a real URL */ }
    }
    if (!tool) return;
    send(tool, href, a.textContent.trim().substring(0, 60));
  }

  document.addEventListener('click', handler, true);
  document.addEventListener('auxclick', handler, true);

  window.showClicks = function () {
    var clicks = [];
    try { clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]'); } catch (e) {}
    if (!clicks.length) { console.log('No clicks recorded yet.'); return; }
    var summary = {};
    clicks.forEach(function (c) { summary[c.tool] = (summary[c.tool] || 0) + 1; });
    console.table(summary);
    console.table(clicks);
  };
})();
