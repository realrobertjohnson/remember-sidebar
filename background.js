// Toolbar icon = on/off switch. "On" means the page script is registered.
const SCRIPT_ID = 'remember-sidebar';
const sizes = [16, 32, 48, 128];
const iconSet = (state) => Object.fromEntries(sizes.map((s) => [s, `icons/${state}-${s}.png`]));

async function apply(enabled) {
  // Only touch the registration when it disagrees with the setting. Removing
  // and re-adding it on every startup left a gap in which restored Miro tabs
  // loaded without the script, and Miro overwrote the saved preference.
  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] });
  if (enabled && registered.length === 0) {
    await chrome.scripting.registerContentScripts([{
      id: SCRIPT_ID,
      matches: ['https://miro.com/app/*'],
      js: ['main.js'],
      runAt: 'document_start',
      world: 'MAIN',
      persistAcrossSessions: true
    }]);
  } else if (!enabled && registered.length > 0) {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  }
  await chrome.action.setIcon({ path: iconSet(enabled ? 'on' : 'off') });
  await chrome.action.setTitle({
    title: enabled
      ? 'Sidebar preference is ON. Click to disable.'
      : 'Click to enable sidebar toggle preference'
  });
}

// Tabs that are already open keep running the script they loaded, so push
// the new on/off state into them directly.
async function syncOpenTabs(enabled) {
  const tabs = await chrome.tabs.query({ url: 'https://miro.com/app/*' });
  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id }, world: 'MAIN',
        func: (on) => { window.__rememberSidebarEnabled = on; },
        args: [enabled]
      });
      if (enabled) {
        // Tab was opened while off: load the script now (no-op if present).
        await chrome.scripting.executeScript({
          target: { tabId: tab.id }, world: 'MAIN', files: ['main.js']
        });
      }
    } catch (_) { /* tab not scriptable right now */ }
  }
}

async function isEnabled() {
  const { enabled } = await chrome.storage.local.get('enabled');
  return enabled !== false; // on by default
}

chrome.runtime.onInstalled.addListener(async () => apply(await isEnabled()));
chrome.runtime.onStartup.addListener(async () => apply(await isEnabled()));
chrome.action.onClicked.addListener(async () => {
  const next = !(await isEnabled());
  await chrome.storage.local.set({ enabled: next });
  await apply(next);
  await syncOpenTabs(next);
});
