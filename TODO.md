# TODO

## SEO / HTML improvements (deferred)

### Render-blocking web font loader
The Google WebFont Loader script in `_templates/head.html` (lines 14-25) runs synchronously via the `fouc` class trick, which blocks rendering until fonts load. This hurts Largest Contentful Paint (LCP), a Core Web Vital and Google ranking factor. Consider:
- Using `<link rel="preconnect">` for Google Fonts
- Switching to `@font-face` with `font-display: swap` in CSS
- Or loading fonts via `<link>` tags with `media="print" onload="this.media='all'"` pattern

### Blog listing heading hierarchy
On blog index and tag pages, post titles use `<h3>` inside an `<article>` that sits under an `<h1>` page title. The `<h2>` for metadata was fixed (changed to `<p>`), but the jump from `<h1>` to `<h3>` for post titles could be improved by promoting post titles to `<h2>`. This would require updating the CSS for `.blog-item-title` accordingly.
