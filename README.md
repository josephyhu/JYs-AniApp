# JYs-AniApp
Display logged in user's anime or manga list.

**Note: You will need an [Anilist](https://anilist.co) account to use this app.**

Steps:
1. Open index.html in the browser and log in using the link.
2. Click the `Authorize` button.
3. Paste the code provided in place of `{code}` on js/authorization.js.
4. Go to the app directory in the terminal.
5. Install node and type `node js/authorization.js` (or just `node authorization.js` if already in the js directory) in the terminal.
6. Copy the token from the terminal.
7. Paste the token provided in place of `{token}` on js/script.js.
8. Open index.html in the browser (or refresh if already on index.html).
9. The rest are self-explanatory.

Features:
* Pagination
* View anime/manga in tabular format. Includes cover image and title with a link to its Anilist page.
* Search anime/manga

Changes:
* Added search functionality.
