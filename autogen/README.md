AutoGen - README

What this package does
----------------------
- Dynamically reads posts from folders inside your GitHub repository and builds category lists on the client side.
- Extracts title and image from HTML and Markdown posts.
- Sorts posts by the latest commit date (configurable).
- Renders lists into DOM containers you specify, and exposes the JSON in window.AUTOGEN_DATA.

How to use
----------
1. Put the folder `/autogen` at the root of your website (already included in this ZIP).
2. Edit CONFIG at the top of `autogen/autogen.js` or override it in HTML via window.AUTOGEN_CONFIG.
3. In your site's HTML, add containers like: <div id="jogos-mobile-list"></div>
4. Include the script: <script type="module" src="/autogen/autogen.js"></script>
5. For private repos use a token assigned to window.AUTOGEN_GITHUB_TOKEN (not recommended client-side).

Optional: GitHub Action is included to prebuild JSON server-side and commit it to the repo.

Limitations
-----------
- GitHub rate limits may apply. For larger sites use server-side generator.
