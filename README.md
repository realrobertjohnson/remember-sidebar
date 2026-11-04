# Remember Sidebar

A small Chrome extension that remembers when you close the Spaces sidebar on
miro.com boards, so it stays closed instead of reopening every time a board
loads.

> Not affiliated with, endorsed by, or sponsored by Miro. "Miro" is a
> trademark of its owner. This extension only changes how the page behaves in
> your own browser.

## The problem

Closing the Spaces sidebar is saved in `localStorage` under
`spaces-sidebar-open-by-user`, but for boards that live inside a Space, the
app writes `{"value":true}` over it on every board load and opens the sidebar
from its own in-memory state. Your preference is stored but not honored.

## What it does

1. **Keeps your saved choice.** It blocks the app's automatic write to that
   key and keeps the value you last set yourself.
2. **Closes the sidebar if the app opens it anyway.** When a board loads (or
   you move to another board inside the app) and your saved choice is
   "closed", it clicks the sidebar's own close button, up to three times in
   the first ten seconds.
3. **Never gets in your way.** Your own toggle (click or keyboard shortcut)
   always works, updates the saved choice, and cancels any pending auto-close.

Boards outside a Space are unaffected.

The toolbar icon is an on/off switch (blue with a check = on, grey with an X =
off). Turning it off takes effect immediately in open tabs.

## Install

- **Chrome Web Store:** _link goes here once published_
- **From source** (also the route for locked-down environments):
  1. Download or clone this repository.
  2. Open `chrome://extensions` and turn on **Developer mode**.
  3. Click **Load unpacked** and select this folder.
  4. Reload any open Miro tabs.

Works in Chrome and Edge, and should work in other Chromium-based browsers
(Brave, Opera, Vivaldi). Firefox and Safari are not supported yet.

## Vet it yourself

There is no build step, no dependencies, and no minification. Three files do
all the work:

| File | What it does |
| --- | --- |
| `manifest.json` | Declares the permissions listed below. |
| `background.js` | Handles the toolbar icon: registers or removes the page script, swaps the icon, and tells already-open tabs to switch on or off. |
| `main.js` | The page script (about 100 lines). Wraps `localStorage.setItem` for one key, and clicks the sidebar's close button when needed. |

| Permission | Why |
| --- | --- |
| `scripting` | Register `main.js` to run on miro.com at document start, and push the on/off state into open tabs. |
| `storage` | Remember the on/off switch. |
| Host access to `https://miro.com/*` | The only site it runs on. |

It makes no network requests and loads no remote code. See `PRIVACY.md`.

To build your own copy for an organization allow-list, change the name and
(optionally) the icons, then zip the files that sit at the top level of this
folder:

```
zip -r remember-sidebar.zip manifest.json background.js main.js icons
```

## Feedback and support

Comments, questions, and bug reports are welcome:

- Bug reports: [open an issue](https://github.com/realrobertjohnson/remember-sidebar/issues)
- Anything else, including questions: [feedback form](https://forms.gle/MdcMbqMqPoieU3Lr7). Your name and
  email are only collected if you ask to be contacted.

## Limitations

- It relies on two things in Miro's page: the `spaces-sidebar-open-by-user`
  key and the sidebar's button and region markup (`data-testid` and
  `aria-label` values). If Miro changes them, the extension can stop working
  until it is updated. Please open an issue.
- Debug logging is off by default. Set `DEBUG = true` in `main.js` to see what
  it does in the DevTools console.

## License

MIT. See `LICENSE`.
