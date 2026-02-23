# Tetragon Publishing - Website

## Project overview
The Tetragon Publishing website, rebuilt from scratch replacing a 15-year-old Foundation 2.x / Compass / Apostrophe CMS / Jekyll stack with modern CSS (Grid, Flexbox, custom properties) and a custom Python build script (Jinja2 + PyYAML). The site has 5 pages: About, Clients, Services, Blog, Contact. All JS is vanilla (no jQuery, no frameworks).

## Build system
Custom Python build script (`build.py`, ~300 lines). Dependencies: `jinja2`, `pyyaml`.

### Commands
- `python build.py` — build the site to `_site/`
- `python build.py serve` — build and start a local dev server on port 8000

### How it works
1. Reads static pages (`index.html`, `clients.html`, etc.) — strips YAML front matter, wraps content with Jinja2 templates
2. Reads blog posts from `blog/_posts/` — parses front matter (title, date, categories), generates excerpts, computes prev/next links
3. Generates blog index, individual post pages, and tag archive pages
4. Copies `assets/` and root files (favicons) to `_site/`
5. Creates `.nojekyll` to prevent GitHub from running Jekyll

## URL structure and SEO

### Blog post URLs
Blog posts are output as flat `.html` files: `_site/blog/YYYY/MM/DD/slug.html`. GitHub Pages serves these at `/blog/YYYY/MM/DD/slug` (no trailing slash, no redirect). Do not change this to `directory/index.html` — that would cause a 301 redirect on every blog post URL.

### Noindex policy
- **Tag archive pages** (`/blog/tag/:slug/`) — `noindex=True`, excluded from sitemap. Low-value aggregation pages.
- **404 page** — `noindex=True`. No canonical tag either (suppressed via `is_404`).
- All other pages (static pages, blog index, blog posts) are fully indexed.

### Sitemap and robots.txt
`sitemap.xml` includes: static pages (not 404), blog index, all blog posts. Tag pages are excluded. `robots.txt` allows all crawlers and advertises the sitemap URL.

### Deployment
GitHub Actions workflow (`.github/workflows/deploy.yml`): push to `main` → Python builds site → deploys to GitHub Pages. See `README.md` for full deployment instructions (remotes, tagging, rollback).

## Versioning
The `.gitignore` excludes all legacy files (old Foundation/Compass/Jekyll/Apostrophe assets). Only new and modified files are tracked. The `*-static.html` preview pages are for local browser testing and are also gitignored.

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

The site declares `color-scheme: light only` to prevent browser auto-darkening on mobile.

## Key dependencies
- Google Fonts (EB Garamond + Lato, loaded via `<link>`)
- Jinja2 + PyYAML (build only, not runtime)

## Working practices

### Changelog
Maintain `CHANGELOG.md` using [Keep a Changelog](https://keepachangelog.com/) format. When committing, add entries under `[Unreleased]` grouped by: Added, Changed, Removed, Fixed. When tagging a release, move unreleased entries into a dated version heading.

### Keeping this file up to date
This file is the source of truth for project conventions. Update it whenever project structure, dependencies, design tokens, breakpoints, or working practices change. Review it at the start of each session and after significant changes — if anything is outdated or wrong, fix it immediately.
