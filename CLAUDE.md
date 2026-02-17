# Tetragon Publishing - Website Redevelopment

## Project overview
Rebuilding the CSS (and eventually JS) for the Tetragon Publishing website from scratch, replacing 15-year-old Foundation 2.x / Compass / Apostrophe CMS stylesheets with modern CSS (Grid, Flexbox, custom properties). The site is a static Jekyll site with 5 pages: About, Clients, Services, Blog, Contact.

## Versioning approach
This repo tracks only **new or modified files**. Old assets (legacy CSS, sprites, Sass source, etc.) remain in the working directory but are excluded via `.gitignore`. The aim is to build totally new CSS and JS, leaving old files in place until the new versions are approved and working.

### Files to version (new/modified work)
- `assets/css/style.css` - new single stylesheet replacing app.css + apostrophe.css
- `assets/img/clients/logos/` - extracted individual client logo PNGs (from sprite)
- `assets/img/services/thumbs/` - extracted individual service thumbnail PNGs (from sprite)
- `assets/img/logo.png`, `logo-notext.png`, `logo-full.png` - extracted from common sprite
- `_includes/head.html` - updated: viewport meta, new stylesheet link, removed IE conditionals
- `_includes/header.html` - updated: added hamburger nav button
- `_layouts/default.html` - updated: removed IE conditionals
- `_layouts/blog.html` - updated: removed IE conditionals and Apostrophe body class
- `_includes/blog-index.html` - updated: removed Apostrophe wrapper div
- `_includes/blog-post.html` - updated: removed Disqus comment count and thread
- `_includes/blog-sidebar.html` - updated: removed google-code-prettify script
- `blog/index.html` - updated: removed columnar class, Disqus spans, cleaned up markup
- `clients.html` - updated: sprite spans replaced with img tags
- `publishing-services.html` - updated: sprite spans replaced with img tags
- `assets/js/common.js` - updated: added hamburger toggle handler
- `index-static.html` - standalone preview page for development
- `clients-static.html` - standalone preview page for development
- `services-static.html` - standalone preview page for development
- `contact-static.html` - standalone preview page for development
- `blog-static.html` - standalone preview page for development (blog listing)
- `blog-post-static.html` - standalone preview page for development (single post)
- `contact.html` - updated: removed validationEngine classes and script tags
- `assets/js/contact.js` - updated: rewritten, removed validationEngine dependency
- `CLAUDE.md` - this file
- `CHANGELOG.md` - project changelog
- `.gitignore`

### Files NOT to version (legacy, left in place)
- `assets/css/app.css` - old compiled Foundation/custom CSS (40KB)
- `assets/css/apostrophe.css` - old CMS styles
- `assets/css/ie.css` - old IE-specific styles
- `assets/css/style.scss` - old Sass source
- `assets/css/foundation/` - old Foundation CSS source
- `assets/css/validationEngine.jquery.css` - no longer used (replaced by native HTML5 validation)
- `assets/js/jquery.validationEngine.js` - no longer used
- `assets/js/jquery.validationEngine-en.js` - no longer used
- `assets/img/spr/` - old sprite sheets (replaced by extracted individual images)
- `assets/img/header-bg.png` - replaced by CSS borders
- `_compass/` - Sass/Foundation/ZURB source and sprites config
- `_sass/` - Sass partials (if present)
- `_site/` - Jekyll build output
- `Gemfile`, `Gemfile.lock`, `Rakefile` - Ruby/Jekyll build dependencies
- `assets/js/apostrophe.js` - CMS artifact (still referenced in head.html, remove when ready)

## Design tokens
```
--color-red: #A01714
--color-dark: #302224
--color-gray: #A19D96
--color-olive: #60632E
--font-body: 'EB Garamond', Georgia, serif
--font-heading: 'Lato', 'Futura', Arial, sans-serif
--max-width: 940px
```

## Responsive breakpoints
- Desktop: 940px+
- Tablet: 768px - 939px
- Phone: 0 - 767px

## Key dependencies still in use
- jQuery (loaded via modernizr.foundation.js)
- jquery.color.js (animated colour transitions for fading links)
- jquery.sharrre.js (social media buttons)
- Google WebFont Loader (EB Garamond + Lato)

## Working practices

### Changelog
Maintain `CHANGELOG.md` using [Keep a Changelog](https://keepachangelog.com/) format. When committing, add entries under `[Unreleased]` grouped by: Added, Changed, Removed, Fixed. When tagging a release, move unreleased entries into a dated version heading.

### Keeping this file up to date
Update `CLAUDE.md` whenever project structure, dependencies, design tokens, breakpoints, or working practices change. If a dependency is added or removed, update the "Key dependencies" list. If new files are added to the repo, update the "Files to version" list. This file is the source of truth for project conventions.
