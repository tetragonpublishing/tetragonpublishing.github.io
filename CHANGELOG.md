# Changelog

All notable changes to the Tetragon Publishing website redevelopment.

## [Unreleased]

### Added
- Custom Python build script (`build.py`) replacing Jekyll — uses Jinja2 + PyYAML (~160 lines)
- Jinja2 templates in `_templates/`: base, head, header, footer, social, blog-index, blog-post, blog-tag, blog-sidebar
- `requirements.txt` for Python dependencies (jinja2, pyyaml)
- GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated build and deploy to GitHub Pages
- `.nojekyll` marker in build output to prevent GitHub from running Jekyll
- Blog tag archive pages generated at `/blog/tag/:slug/`
- Prev/next post data available in blog post template context

### Changed
- Build system: replaced Jekyll (Ruby) with custom Python build script + Jinja2 templates
- Templates: Liquid syntax replaced with Jinja2 (template inheritance, includes, filters)
- Nav active state: now computed in header.html template via `nav_active` variable (replaces Jekyll `page.url` conditionals)
- Contact page: `contact.js` script tag moved from page content to base template `extra_js` mechanism

### Removed
- Jekyll dependency: `_config.yml`, `_layouts/`, `_includes/`, `Gemfile`, `Gemfile.lock`, `Rakefile` no longer needed for build (kept locally, gitignored)
- Ruby/Bundler/Gems build toolchain — replaced by Python/pip
- All legacy jQuery plugins from page output (modernizr.foundation.js, jquery.color.js, jquery.sharrre.js, app.js, etc.)
- `apostrophe.js` script reference from head template

### Changed
- Blog page: cleaned up blog index template — removed Apostrophe `columnar` class from excerpt content, removed `blog-browser` wrapper div
- Blog page: cleaned up blog post template — removed Disqus comment count from meta, removed Disqus thread and embed script
- Blog page: removed `a-blog` body class from blog layout (Apostrophe CMS remnant)
- Blog page: removed google-code-prettify script from sidebar include
- Blog CSS: removed dead `.blog-item-content.columnar` rules (desktop and phone), removed `.aut a` rule (no links in element), removed `#disqus_thread` styles
- Contact page: replaced jQuery validationEngine with native HTML5 validation (required, type=email)
- Contact page: contact.js rewritten — cleaned up code, removed validationEngine dependency, consistent formatting
- Services page: replaced Orbit slider + Reveal modal plugins with vanilla JS modal slider (~45 lines, no dependencies)
- Services page: modal HTML restructured — captions inline as figcaptions instead of 22 external orbit-caption divs
- Services page: modal CSS now inherently responsive (flexbox centering, percentage width) — no tablet/phone overrides needed
- Services page: reduced excessive margin-bottom on .services-list from 150px to 50px (30px at phone)
- Services page: moved flex stacking (aside below text) from phone-only to tablet breakpoint for better text readability
- Services page: tablet now unfloats figures (square-banner, left-banner, hosting-banner) and pic-grid
- Services page: slimmed phone-specific overrides (stacking inherited from tablet, phone only adjusts max-widths and heading size)
- Clients page: removed stale Foundation margin offset from content sections
- Clients page: added tablet breakpoint rules (narrower grid columns, logo centered above text)
- Clients page: added cursor pointer on phone client names
- Footer: address stacked below "Tetragon" heading, red vertical bar connects to horizontal border at all sizes
- Footer: social media widget moved to bottom-right of main container (new social.html include)
- Phone nav: replaced hamburger dropdown with horizontal inline links and bullet separators (About · Clients · Services / Blog · Contact)
- Reinstated dotted top border on hgroup at phone size
- Shrunk hamburger button (now hidden, kept in CSS for potential reuse)
- Replaced jQuery Orbit home page slideshow with custom vanilla JS horizontal slider
- Slideshow now uses CSS flexbox + translateX transitions instead of Orbit plugin
- Slideshow arrows always visible (not hover-only) for touch device compatibility
- Slideshow reorders below intro paragraph on tablet/phone using flexbox order
- Responsive slideshow uses aspect-ratio instead of fixed pixel dimensions

### Added
- Vanilla JS modal slider for services page galleries (IIFE, ~45 lines, no dependencies)
- Keyboard support for modals (Escape to close, click-outside to close)
- services-static.html standalone preview page for browser testing (no Jekyll needed)
- contact-static.html standalone preview page for browser testing (no Jekyll needed)
- blog-static.html standalone preview page for browser listing (no Jekyll needed)
- blog-post-static.html standalone preview page for blog post (no Jekyll needed)
- Prev/next arrow buttons on home page slideshow (index.html, index-static.html)
- Custom slider JS in common.js (IIFE, ~12 lines, no dependencies)

### Removed
- jquery.validationEngine-en.js, jquery.validationEngine.js, and validationEngine.jquery.css references from contact page
- jquery.orbit-1.4.0.js and jquery.reveal.js script references from all pages (no longer used)
- ~145 lines of Orbit/Reveal CSS (orbit-wrapper, slider-nav, orbit-caption, orbit-bullets, reveal-modal)
- Orbit/Reveal JS setup in common.js (~50 lines of jQuery plugin calls)
- 22 external orbit-caption divs from services page HTML
- jQuery Orbit initialisation for home page slides in common.js
- Orbit-specific CSS rules (.orbit-slide, loading gif, display:none defaults)
- Disqus comment count spans from blog index and blog post templates
- Disqus thread embed script from blog post template
- google-code-prettify script reference from blog sidebar
- `a-blog` body class from blog layout (Apostrophe CMS artifact)
- Dead blog CSS: `.blog-item-content.columnar` width override, `.aut a` link rule, `#disqus_thread` styles

## [0.2.0] - 2026-02-16

### Changed
- Stripped all Foundation grid classes (row, columns, offset-by-*, centered) from HTML
- Replaced with semantic class names (service-text, service-aside, contact-layout, etc.)
- Replaced Apostrophe CMS blog class names (a-blog-item-*) with clean equivalents (blog-item-*)
- CSS now uses CSS Grid for page layouts (clients 3-col, contact 2-col, blog main+sidebar)
- CSS now uses Flexbox for nav, services dropdowns, and responsive reordering
- Updated nav JS selector from '#main-nav div a' to '#main-nav a'

### Removed
- Foundation grid CSS compatibility block (~100 lines of .row, .columns rules)
- Apostrophe CMS wrapper divs from all layout templates
- IE conditional comments from layouts
- Google Analytics, Google+ button, and old Apostrophe JS from footer

## [0.1.0] - 2026-02-16

### Added
- New single stylesheet (style.css) replacing app.css + apostrophe.css
- CSS custom properties for design tokens (colors, fonts, max-width)
- Responsive breakpoints: desktop 940px+, tablet 768-939px, phone 0-767px
- Hamburger nav toggle for mobile
- Extracted individual images from sprite sheets (client logos, service thumbs, site logo)
- index-static.html standalone preview page
- CLAUDE.md project documentation
- .gitignore excluding legacy assets
