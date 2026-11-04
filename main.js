// Runs in the page's own context at document_start (before Miro's code).
(() => {
  if (window.__rememberSidebar) return;
  window.__rememberSidebar = true;

  const DEBUG = false; // set true to see what it does in the console
  // The toolbar switch flips this flag live in tabs that are already open.
  const on = () => window.__rememberSidebarEnabled !== false;
  const log = (...a) => DEBUG && on() && console.log('[remember-sidebar]', ...a);
  const KEY = 'spaces-sidebar-open-by-user';
  const origSet = Storage.prototype.setItem;
  const origGet = Storage.prototype.getItem;

  // Your preference as it was before Miro touched anything.
  let preferred = origGet.call(localStorage, KEY);
  const isClosed = (s) => { try { return JSON.parse(s)?.value === false; } catch (_) { return false; } };

  // --- Telling your toggle from Miro's automatic one -------------------
  // A write counts as yours only if a real click/keypress happened AFTER the
  // latest navigation and within 400 ms. The click that opens a board comes
  // before the navigation, so it does not count.
  let lastGesture = 0;
  let lastNav = Date.now();
  const mark = (e) => { if (e.isTrusted) lastGesture = Date.now(); };
  ['pointerdown', 'keydown', 'click'].forEach((t) => addEventListener(t, mark, true));

  let token = 0; // bumping this cancels any running "close it" attempt

  Storage.prototype.setItem = function (k, v) {
    if (this === localStorage && k === KEY) {
      const user = lastGesture > lastNav && Date.now() - lastGesture < 400;
      if (user) {
        preferred = v;
        token++;
        log('your toggle saved:', v);
      } else if (on() && preferred !== null && v !== preferred) {
        log('blocked automatic write', v, '-> kept', preferred);
        return origSet.call(this, k, preferred);
      }
    }
    return origSet.apply(this, arguments);
  };

  // --- Closing the sidebar if Miro opens it from internal state --------
  const onBoard = () => location.pathname.startsWith('/app/board/');
  const sidebarOpen = () => {
    const r = document.querySelector('[aria-label="Spaces sidebar"]');
    return !!r && r.getBoundingClientRect().width > 0;
  };

  function enforce() {
    const mine = ++token;
    if (!on() || !isClosed(preferred)) return;
    const started = Date.now();
    let clicks = 0;
    const timer = setInterval(() => {
      if (mine !== token || !on() || !onBoard() || Date.now() - started > 10000 || clicks >= 3) {
        return clearInterval(timer);
      }
      const btn = document.querySelector('[data-testid="collapse-spaces-sidebar-button"]');
      if (btn && sidebarOpen()) {
        clicks++;
        log('closing sidebar (attempt ' + clicks + ')');
        btn.click();
      }
    }, 200);
  }

  // Board-to-board moves inside the app don't reload the page.
  let lastPath = location.pathname;
  const onNav = () => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    lastNav = Date.now();
    enforce();
  };
  for (const fn of ['pushState', 'replaceState']) {
    const orig = history[fn];
    history[fn] = function () { const r = orig.apply(this, arguments); onNav(); return r; };
  }
  addEventListener('popstate', onNav);

  log('installed; saved value at load =', preferred);
  enforce();
})();
