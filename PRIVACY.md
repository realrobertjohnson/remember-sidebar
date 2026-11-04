# Privacy policy: Remember Sidebar

Remember Sidebar does not collect, store, transmit, or share any personal data.

- It makes no network requests of its own.
- It has no analytics, telemetry, or remote code.
- It runs only on `https://miro.com/app/*`.
- On those pages it reads and rewrites one browser `localStorage` entry
  (`spaces-sidebar-open-by-user`) that records whether the Spaces sidebar is
  open, and it may click the sidebar's own close button.
- To tell your own toggle from the page's automatic one, it notes (in memory
  only) whether a real click or key press happened in the last fraction of a
  second. It does not record what you click or type, and nothing about this is
  saved or sent anywhere.
- The only thing it saves is its own on/off switch, in Chrome's extension
  storage on your device (`chrome.storage.local`).

## Feedback form

The optional [feedback form](https://forms.gle/MdcMbqMqPoieU3Lr7) is separate from the extension. It
collects your name and email only if you choose to be contacted, and uses them
only to reply to you. Responses are stored in the author's Google account.

Questions or concerns: [open an issue](https://github.com/realrobertjohnson/remember-sidebar/issues) in this repository.
