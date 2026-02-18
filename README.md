# Tetragon Publishing Website

Static website for [tetragonpublishing.com](https://tetragonpublishing.com). Typesetting, copy-editing, eBooks and pre-press production for publishers.

## Quick start

```bash
pip install -r requirements.txt   # one-time: installs jinja2 + pyyaml
python build.py                   # build site to _site/
python build.py serve             # build + local dev server on http://localhost:8000
```

The dev server does **not** hot-reload. After editing files, kill the server (Ctrl+C) and re-run `python build.py serve`.

## Git remotes

This repo has two remotes:

- **`origin`** — private dev repo at `https://github.com/tetragonpublishing/website-redevelopment.git` (for backup/versioning during development)
- **`live`** — the public GitHub Pages repo at `https://github.com/tetragonpublishing/tetragonpublishing.github.io.git` (pushing here triggers deployment)

Check with `git remote -v`. If `live` is missing, add it:

```bash
git remote add live https://github.com/tetragonpublishing/tetragonpublishing.github.io.git
```

## Deployment

Deployment is fully automatic via GitHub Actions on the `live` remote. Here's what happens:

### The normal workflow

1. Make your changes locally
2. Test with `python build.py serve` and check `http://localhost:8000`
3. Commit your changes
4. Push to the private dev repo (optional, for backup):
   ```bash
   git push origin main
   ```
5. Push to the live repo to deploy (local `main` → remote `master`):
   ```bash
   git push live main:master
   ```
6. GitHub Actions automatically:
   - Checks out the repo
   - Installs Python 3.12 and the pip dependencies
   - Runs `python build.py` (generates `_site/`)
   - Uploads `_site/` as a GitHub Pages artifact
   - Deploys to GitHub Pages
7. The site is live at `https://tetragonpublishing.com` within a couple of minutes

### Checking deployment status

- Go to the repo on GitHub → **Actions** tab to see the workflow runs
- Green tick = deployed successfully, red cross = something failed
- Click into a failed run to see the build log and error details
- You can also manually trigger a deploy from Actions → "Build and Deploy" → "Run workflow"

### How it works under the hood

The workflow is defined in `.github/workflows/deploy.yml`. It uses GitHub's official Pages actions (not the older `gh-pages` branch method). The key settings:

- **Trigger**: any push to `main`, or manual trigger (`workflow_dispatch`)
- **Concurrency**: only one deploy runs at a time; a new push cancels any in-progress deploy
- **Permissions**: the workflow has write access to Pages and read access to the repo (set in the yml, not in repo settings)
- **No `gh-pages` branch**: the site is deployed directly from the workflow artifact, not pushed to a separate branch

### If something goes wrong

- The live site stays on the **last successful deploy** until the next successful one — a failed build won't take the site down
- Check the Actions tab for error details (usually a Python/template error in build.py)
- Fix locally, test with `python build.py`, commit, push again

### Rolling back to the old Jekyll site

The previous Jekyll version of the site is preserved as the git tag `legacy-jekyll` (tagged from `live/master` — the old repo used `master` as its default branch). To restore it:

```bash
git checkout legacy-jekyll       # switch to the old version locally
# or, to fully roll back:
git reset --hard legacy-jekyll
git push --force live HEAD:master   # deploy the old site to live/master
```

The old Jekyll site will deploy and go live within a couple of minutes (GitHub Pages still supports Jekyll natively). To switch back to the current Python build, reset to the latest commit and push to `live` again.

Note: the live repo's default branch is `master`. When pushing the new site, use `git push --force live main:master` (or change the default branch to `main` in the repo's GitHub settings).

### DNS and domain

The site is served via GitHub Pages with a custom domain (`tetragonpublishing.com`). The DNS CNAME record is configured at the domain registrar, not in this repo. If GitHub Pages ever loses the custom domain setting (it shouldn't), re-add it in the repo's Settings → Pages → Custom domain.

## How the build works

`build.py` (~240 lines of Python) replaces the old Jekyll setup. It:

1. Reads **static pages** (`index.html`, `clients.html`, `publishing-services.html`, `contact.html`, `404.html`) — strips YAML front matter, wraps content with Jinja2 templates
2. Reads **blog posts** from `blog/_posts/` — parses front matter (title, date, categories), generates excerpts from `<!--more-->` markers, computes prev/next links
3. Generates blog index, individual post pages, and tag archive pages (`/blog/tag/:slug/`)
4. Copies `assets/` and root files (favicons) into `_site/`
5. Creates `.nojekyll` so GitHub Pages doesn't try to run Jekyll

## Site structure

```
.
├── build.py                  # Build script (the only build dependency beyond pip)
├── requirements.txt          # Python deps: jinja2, pyyaml
├── _templates/               # Jinja2 templates
│   ├── base.html             #   Page shell (doctype, head, body, scripts)
│   ├── head.html             #   <head>: meta, fonts, CSS, GA4
│   ├── header.html           #   Logo + nav bar
│   ├── footer.html           #   Footer with contact details
│   ├── social.html           #   (empty — social sharing removed)
│   ├── blog-index.html       #   Blog listing page
│   ├── blog-post.html        #   Individual blog post
│   ├── blog-sidebar.html     #   Blog sidebar (tags, recent posts)
│   └── blog-tag.html         #   Posts filtered by tag
│
├── index.html                # About page content
├── clients.html              # Clients page content
├── publishing-services.html  # Services page content
├── contact.html              # Contact page content (form posts to dev.tetragonpublishing.com/m)
├── 404.html                  # Error page content
│
├── blog/
│   ├── index.html            # Blog index (Jinja2, not used directly — see _templates)
│   └── _posts/               # Blog posts (YAML front matter + HTML)
│       ├── 2012-03-23-introducing.html
│       ├── 2012-05-25-killing-runts-in-indesign-with-grep.html
│       └── ...               # 9 posts total
│
├── assets/
│   ├── css/style.css         # Single stylesheet (replaces old Foundation/Apostrophe CSS)
│   ├── js/common.js          # All vanilla JS (nav, dropcaps, sliders, modals, etc.)
│   ├── js/contact.js         # Contact form + Google Maps (loaded only on /contact)
│   └── img/
│       ├── blog/             # Blog post images
│       ├── clients/          # Client logos and sample spreads
│       │   └── logos/        # Individual client logo PNGs
│       ├── home/             # Homepage slider images
│       └── services/         # Service page images and thumbnails
│           └── thumbs/       # Typesetting sample thumbnails
│
├── favicon.ico               # Favicons
├── favicon.png
├── apple-touch-icon.png
│
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions: build + deploy to Pages
│
├── CLAUDE.md                 # AI assistant context file
└── CHANGELOG.md              # Project changelog
```

## Pages

Each page is an HTML file in the repo root with YAML front matter (`title`, `description`). The build script strips the front matter and wraps the content with `_templates/base.html`.

To add a new page: create `my-page.html` with front matter, then add an entry to the `PAGES` list in `build.py`.

## Blog posts

Posts live in `blog/_posts/` and follow the naming convention `YYYY-MM-DD-slug.html`. Front matter fields:

```yaml
---
layout: post
title: "Post Title"
date: 2012-05-25 18:10:11 -0100
categories: ['Tag1', 'Tag2']
---
```

Use `<!--more-->` to mark where the excerpt ends on the blog index.

Images go in `assets/img/blog/`. Some posts contain legacy Apostrophe CMS markup (slideshow `<ul>`/`<li>` structures with classes like `a-slideshow`) — this is rendered as-is and styled in `style.css`.

Blog comments are baked into the post HTML as static `<div class="blog-comments">` blocks (imported from Disqus, curated). There is no dynamic comment system.

## Templates

Templates use [Jinja2](https://jinja.palletsprojects.com/) syntax. Key variables passed to templates:

- `title`, `description` — page metadata
- `nav_active` — which nav item to highlight (`about`, `clients`, `services`, `blog`, `contact`)
- `body_class` — CSS class on `<body>` (e.g. `a-home`)
- `content` — page HTML content (static pages only)
- `post` — blog post dict with `title`, `date`, `url`, `content`, `categories`, etc.
- `posts` — list of all posts (blog index)
- `popular_tags` — tags appearing in 2+ posts (sidebar)
- `extra_js` — additional JS files to load (e.g. `contact.js`)

Custom Jinja2 filter: `slugify` (used for tag URLs).

## Design tokens

```
--color-red:    #A01714
--color-dark:   #302224
--color-gray:   #A19D96
--font-body:    'EB Garamond' (Google Fonts)
--font-heading: 'Lato' (Google Fonts)
```

Fonts are loaded via Google WebFont Loader (async, with FOUC prevention).

## External services

- **Google Analytics**: GA4, tag `G-QST4TK37YN` (in `_templates/head.html`)
- **Google Maps**: on the contact page, API key in `contact.js`
- **Contact form**: posts to `https://dev.tetragonpublishing.com/m` (PHP, separate server/repo)

## History

The site was originally built on Apostrophe CMS (Symfony/PHP), then migrated to Jekyll (Ruby), then to this custom Python build in Feb 2026. Some blog post HTML still contains Apostrophe CMS markup (slideshow structures, `data-pageid` attributes, etc.) which is harmless and rendered as-is.
