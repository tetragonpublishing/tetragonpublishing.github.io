# TODO

- [x] Port site from Jekyll to a modern static site generator. Update templates to match the static pages we've already created. Set up build and deploy to GitHub Pages (run a command, everything uploads). **Done: replaced Jekyll with custom Jinja2 build script (`build.py`). GitHub Actions workflow deploys on push to main.**
- [x] Research and add a modern social media sharing widget to replace the dead Sharrre/Google+/Digg buttons. **Done: removed entirely — not useful for a B2B services site.**
- [x] Decide on blog comments: replace dead Disqus with a modern alternative, or remove commenting entirely. **Done: removed Disqus, baked existing comments into static HTML (curated). No new comment system — not needed for a B2B services blog.**
- [x] Decide on analytics: old Universal Analytics (UA-15368185-1) is dead. Set up GA4 or remove tracking entirely. **Done: GA4 (G-QST4TK37YN) added to `_templates/head.html`.**
