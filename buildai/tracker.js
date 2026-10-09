/* ===========================================
   AFFILIATE CLICK TRACKER (merged build)
   Tracks outbound affiliate clicks (direct
   vendor URLs *and* cloaked /go/* links) and
   logs them: console + localStorage dashboard
   + Netlify Forms "click-tracking".
   =========================================== */

(function () {
  'use strict';

  // Map hostnames AND /go/ slugs to clean tool names
  const TOOL_MAP = {
    'durable.co': 'Durable AI',
    'dorik.com':  'Dorik AI',
    'framer.com': 'Framer',
    'wix.com':    'Wix AI',
    '10web.io':   '10Web'
  };
  const GO_SLUG_MAP = {
    durable: 'Durable AI',
    dorik:   'Dorik AI',
    framer:  'Framer',
    wix:     'Wix AI',
    '10web': '10Web'
  };

  function toolFromHref(href) {
    // Cloaked internal link: /go/durable → Durable AI
    const go = href.match(/^\/go\/([a-z0-9-]+)/i);
    if (go) return GO_SLUG_MAP[go[1].toLowerCase()] || go[1];
    try {
      const host = new URL(href, window.location.origin).hostname.replace('www.', '');
      return TOOL_MAP[host] || host;
    } catch (e) {
      return 'Unknown';
    }
  }

  function isAffiliateLink(href) {
    if (/^\/go\//i.test(href)) return true;
    return Object.keys(TOOL_MAP).some(function (d) { return href.indexOf(d) !== -1; });
  }

  function getPageName() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path === '') return 'Homepage';
    const m = path.match(/^\/reviews\/([a-z0-9-]+)/i);
    if (m) return 'Review: ' + m[1];
    if (path.indexOf('/compare/') === 0) return 'Compare: ' + path.replace(/\/+$/, '').split('/').pop();
    const map = { 'review.html': 'Review', 'compare.html': 'Compare', 'index.html': 'Homepage' };
    const base = path.split('/').pop();
    return map[base] || path;
  }

  function sendClickEvent(tool, href, label) {
    // 1. Console (always)
    console.log('[Affiliate Click] ' + tool + ' | Page: ' + getPageName() + ' | Label: "' + label + '"');

    // 2. localStorage dashboard (see showClicks())
    try {
      const key = 'affiliate_clicks';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ tool: tool, page: getPageName(), label: label, href: href, ts: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) { /* private mode etc. — never break the click */ }

    // 3. Netlify Forms (non-blocking, never delays the redirect)
    const payload = new FormData();
    payload.append('form-name', 'click-tracking');
    payload.append('tool', tool);
    payload.append('page', getPageName());
    payload.append('label', label);
    payload.append('href', href);
    payload.append('timestamp', new Date().toISOString());
    payload.append('referrer', document.referrer || 'direct');

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/', payload);
      } else {
        fetch('/', { method: 'POST', body: payload }).catch(function () {});
      }
    } catch (e) { /* silent */ }
  }

  function initTracking() {
    document.addEventListener('click', function (e) {
      const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (!isAffiliateLink(href)) return;

      link.setAttribute('data-tracked', 'true');
      const tool = link.getAttribute('data-tool') ? link.getAttribute('data-tool') : toolFromHref(href);
      const label = (link.textContent || '').trim().substring(0, 60);
      sendClickEvent(tool, link.href || href, label);
      // Never block navigation — the /go/ 302 (or vendor tab) proceeds as normal.
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

  // Console dashboard — open DevTools and type: showClicks()
  window.showClicks = function () {
    let clicks = [];
    try { clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]'); } catch (e) {}
    if (!clicks.length) { console.log('No clicks recorded yet.'); return; }

    const summary = {};
    clicks.forEach(function (c) { summary[c.tool] = (summary[c.tool] || 0) + 1; });

    console.group('📊 Affiliate Click Summary');
    Object.entries(summary)
      .sort(function (a, b) { return b[1] - a[1]; })
      .forEach(function (entry) { console.log(entry[0] + ': ' + entry[1] + ' click' + (entry[1] > 1 ? 's' : '')); });
    console.groupEnd();

    console.group('📋 Full Click Log');
    clicks.forEach(function (c) { console.log('[' + c.ts + '] ' + c.tool + ' — "' + c.label + '" on ' + c.page); });
    console.groupEnd();
  };
})();
