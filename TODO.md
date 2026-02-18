# TODO

## SEO / HTML improvements (deferred)

### `<dl>` without `<dt>` on clients page
The clients navigation sidebar (`clients.html` lines 15-28) uses `<dl>` with only `<dd>` elements and no `<dt>`. This is invalid HTML — a definition list requires definition terms. Consider changing to a `<ul>/<li>` structure, which would require updating the CSS selectors and any JS that targets `dl.clients-list dd`.

The dot navigation (`clients.html` lines 316-379) has the same issue — `<dl class="client-nav">` with only `<dd>` children. Again, `<ul>/<li>` would be more appropriate.

### Render-blocking web font loader
The Google WebFont Loader script in `_templates/head.html` (lines 14-25) runs synchronously via the `fouc` class trick, which blocks rendering until fonts load. This hurts Largest Contentful Paint (LCP), a Core Web Vital and Google ranking factor. Consider:
- Using `<link rel="preconnect">` for Google Fonts
- Switching to `@font-face` with `font-display: swap` in CSS
- Or loading fonts via `<link>` tags with `media="print" onload="this.media='all'"` pattern

### Blog listing heading hierarchy
On blog index and tag pages, post titles use `<h3>` inside an `<article>` that sits under an `<h1>` page title. The `<h2>` for metadata was fixed (changed to `<p>`), but the jump from `<h1>` to `<h3>` for post titles could be improved by promoting post titles to `<h2>`. This would require updating the CSS for `.blog-item-title` accordingly.
