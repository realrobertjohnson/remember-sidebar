# Chrome Web Store listing text (for copy and paste)

**Name:** Remember Sidebar

**Summary (max 132 chars):**
Remembers when you close the Spaces sidebar on miro.com boards, so it stays closed instead of reopening on every board load.

**Category:** Productivity

**Detailed description:**
Closing the Spaces sidebar on a board is saved, but boards inside a Space reopen it every time they load. Remember Sidebar makes your choice stick.

- Close the sidebar once and it stays closed on the next board, after a page reload, and after restarting your browser.
- Open it yourself whenever you like. Your own toggle always works and is remembered.
- One click on the toolbar icon turns the extension on or off, instantly.
- Runs only on miro.com. Collects no data and makes no network requests.
- Open source, with no build step, so it is easy to review: (repository link)

Not affiliated with or endorsed by Miro.

## Privacy tab answers

**Single purpose:**
Keep the Spaces sidebar on miro.com boards closed when the user has closed it, instead of letting it reopen on every board load.

**Permission justifications:**
- `scripting`: Registers one packaged script that runs on miro.com at document start, and tells already-open tabs to switch the script on or off when the user clicks the toolbar icon.
- `storage`: Saves the extension's on/off switch on the user's device.
- Host permission `https://miro.com/*`: The only site the extension works on. It reads and rewrites one localStorage key that records the sidebar state and may click the sidebar's own close button.

**Remote code:** No. All code is in the package.

**Data usage:** Collects none of the listed data types. Not sold or transferred. Not used for unrelated purposes or creditworthiness.

**Privacy policy URL:** (link to PRIVACY.md in the repository)
