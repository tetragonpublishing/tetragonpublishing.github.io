# TODO

## SEO / HTML improvements (deferred)

### Render-blocking web font loader
The Google WebFont Loader script in `_templates/head.html` (lines 14-25) runs synchronously via the `fouc` class trick, which blocks rendering until fonts load. This hurts Largest Contentful Paint (LCP), a Core Web Vital and Google ranking factor. Consider:
- Using `<link rel="preconnect">` for Google Fonts
- Switching to `@font-face` with `font-display: swap` in CSS
- Or loading fonts via `<link>` tags with `media="print" onload="this.media='all'"` pattern

