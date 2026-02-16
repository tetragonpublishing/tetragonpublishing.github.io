# Changelog

All notable changes to the Tetragon Publishing website redevelopment.

## [Unreleased]

### Changed
- Replaced jQuery Orbit home page slideshow with custom vanilla JS horizontal slider
- Slideshow now uses CSS flexbox + translateX transitions instead of Orbit plugin
- Slideshow arrows always visible (not hover-only) for touch device compatibility
- Slideshow reorders below intro paragraph on tablet/phone using flexbox order
- Responsive slideshow uses aspect-ratio instead of fixed pixel dimensions

### Added
- Prev/next arrow buttons on home page slideshow (index.html, index-static.html)
- Custom slider JS in common.js (IIFE, ~12 lines, no dependencies)

### Removed
- jQuery Orbit initialisation for home page slides in common.js
- Orbit-specific CSS rules (.orbit-slide, loading gif, display:none defaults)

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
