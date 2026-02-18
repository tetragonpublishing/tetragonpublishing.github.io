#!/usr/bin/env python3
"""
build.py — Static site builder for Tetragon Publishing.
Replaces Jekyll with ~150 lines of Python + Jinja2.

Usage:
    python build.py          Build site to _site/
    python build.py serve    Build and start a local dev server on port 8000

Dependencies: jinja2, pyyaml (see requirements.txt)
"""
import functools
import os
import re
import sys
import shutil
from datetime import datetime
from collections import defaultdict
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

import yaml
from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).parent
TEMPLATES = ROOT / '_templates'
POSTS_DIR = ROOT / 'blog' / '_posts'
OUTPUT = ROOT / '_site'

# Pages: source file, output path, canonical URL, nav highlight, body class, extra JS
PAGES = [
    {'src': 'index.html',               'out': 'index.html',               'url': '/',                    'nav': 'about',    'body_class': 'a-home'},
    {'src': 'clients.html',             'out': 'clients.html',             'url': '/clients',             'nav': 'clients',  'body_class': 'a-home'},
    {'src': 'publishing-services.html', 'out': 'publishing-services.html', 'url': '/publishing-services', 'nav': 'services', 'body_class': 'a-home'},
    {'src': 'contact.html',             'out': 'contact.html',             'url': '/contact',             'nav': 'contact',  'body_class': 'a-home', 'extra_js': ['/assets/js/contact.js']},
    {'src': '404.html',                 'out': '404.html',                 'url': '/404',                 'nav': None,        'body_class': ''},
]

SITE_URL = 'https://tetragonpublishing.com'

# Static files/dirs to copy to _site
COPY_FILES = ['favicon.ico', 'favicon.png', 'apple-touch-icon.png']
COPY_DIRS  = ['assets']


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_front_matter(text):
    """Strip YAML front matter, return (meta dict, content string)."""
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?', text, re.DOTALL)
    if m:
        return yaml.safe_load(m.group(1)) or {}, text[m.end():]
    return {}, text


def strip_html(text):
    """Remove HTML tags from a string."""
    return re.sub(r'<[^>]+>', '', text)


def slugify(text):
    """Convert text to a URL-safe slug."""
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def format_date(dt):
    """Format a datetime as 'Feb 2 \\'17' to match the existing site."""
    return f"{dt.strftime('%b')} {dt.day} '{dt.strftime('%y')}"


# ---------------------------------------------------------------------------
# Read blog posts
# ---------------------------------------------------------------------------

def read_posts():
    """Read all blog posts from blog/_posts/, return list sorted newest-first."""
    posts = []
    for f in POSTS_DIR.glob('*.html'):
        meta, content = parse_front_matter(f.read_text(encoding='utf-8'))

        # Parse date
        date = meta.get('date')
        if isinstance(date, str):
            date = datetime.strptime(date.rsplit(' ', 1)[0], '%Y-%m-%d %H:%M:%S')

        # URL: /blog/:year/:month/:day/:slug
        slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', f.stem)
        url = f'/blog/{date.year}/{date.month:02d}/{date.day:02d}/{slug}'

        # Categories from front matter
        categories = meta.get('categories', [])

        # Excerpt: text before <!--more-->, or first 250 chars, HTML stripped
        parts = content.split('<!--more-->')
        raw_excerpt = parts[0] if len(parts) > 1 else content
        excerpt = strip_html(raw_excerpt).strip()
        if len(excerpt) > 250:
            excerpt = excerpt[:250].rsplit(' ', 1)[0]

        # Strip the excerpt separator from rendered content
        content = content.replace('<!--more-->', '')

        # Find latest comment date (comments have "· Mon DD, YYYY" format)
        comment_dates = re.findall(
            r'class="blog-comment-meta">[^·]*·\s*(\w+ \d{1,2}, \d{4})', content
        )
        last_modified = date
        for cd in comment_dates:
            try:
                parsed = datetime.strptime(cd, '%b %d, %Y')
                if parsed > last_modified:
                    last_modified = parsed
            except ValueError:
                pass

        posts.append({
            'title': meta.get('title', ''),
            'date': date,
            'date_display': format_date(date),
            'date_iso': date.strftime('%Y-%m-%d'),
            'last_modified': last_modified.strftime('%Y-%m-%d'),
            'url': url,
            'slug': slug,
            'categories': categories,
            'content': content.strip(),
            'excerpt': excerpt,
        })

    posts.sort(key=lambda p: p['date'], reverse=True)

    # Link prev/next
    for i, post in enumerate(posts):
        post['prev'] = posts[i + 1] if i + 1 < len(posts) else None
        post['next'] = posts[i - 1] if i > 0 else None

    return posts


def build_tags(posts):
    """Group posts by category. Return (all_tags dict, popular list)."""
    tags = defaultdict(list)
    for post in posts:
        for cat in post['categories']:
            tags[cat].append(post)

    popular = sorted(
        [(name, ps) for name, ps in tags.items() if len(ps) > 1],
        key=lambda x: (-len(x[1]), x[0]),
    )
    return dict(tags), popular


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build():
    env = Environment(loader=FileSystemLoader(str(TEMPLATES)), autoescape=False)
    env.filters['slugify'] = slugify

    posts = read_posts()
    all_tags, popular_tags = build_tags(posts)

    # Clean output
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()

    # --- Static pages ---
    base = env.get_template('base.html')
    for page in PAGES:
        meta, content = parse_front_matter((ROOT / page['src']).read_text('utf-8'))
        html = base.render(
            content=content,
            title=meta.get('title', 'Tetragon Publishing'),
            description=meta.get('description', ''),
            page_url=page.get('url', '/'),
            nav_active=page.get('nav', ''),
            body_class=page.get('body_class', ''),
            extra_js=page.get('extra_js', []),
            is_404=(page['out'] == '404.html'),
        )
        out = OUTPUT / page['out']
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding='utf-8')
        print(f'  {page["out"]}')

    # --- Blog index ---
    html = env.get_template('blog-index.html').render(
        title='Tetragon | Blog',
        description='News, Comments and Help for Publishers and Typesetters',
        page_url='/blog',
        nav_active='blog', posts=posts, popular_tags=popular_tags,
    )
    (OUTPUT / 'blog').mkdir(parents=True, exist_ok=True)
    (OUTPUT / 'blog' / 'index.html').write_text(html, encoding='utf-8')
    print('  blog/index.html')

    # --- Blog posts ---
    tpl = env.get_template('blog-post.html')
    for post in posts:
        # Truncate description to ~160 chars on a sentence or word boundary
        desc = post['excerpt']
        if len(desc) > 160:
            # Try to end on a sentence within 160 chars
            truncated = desc[:160]
            last_period = truncated.rfind('.')
            if last_period > 80:
                desc = truncated[:last_period + 1]
            else:
                desc = truncated.rsplit(' ', 1)[0] + '...'
        html = tpl.render(
            title=f'Tetragon | {post["title"]}',
            description=desc,
            page_url=post['url'],
            og_type='article',
            nav_active='blog', post=post, popular_tags=popular_tags,
        )
        d = OUTPUT / post['url'].lstrip('/')
        d.mkdir(parents=True, exist_ok=True)
        (d / 'index.html').write_text(html, encoding='utf-8')
        print(f'  {post["url"]}')

    # --- Tag pages ---
    tpl = env.get_template('blog-tag.html')
    for tag_name, tag_posts in all_tags.items():
        s = slugify(tag_name)
        html = tpl.render(
            title=f'Tetragon | Blog | {tag_name}',
            description=f'Posts tagged \'{tag_name}\'',
            page_url=f'/blog/tag/{s}',
            nav_active='blog', tag_name=tag_name,
            posts=tag_posts, popular_tags=popular_tags,
            noindex=True,
        )
        d = OUTPUT / 'blog' / 'tag' / s
        d.mkdir(parents=True, exist_ok=True)
        (d / 'index.html').write_text(html, encoding='utf-8')
        print(f'  /blog/tag/{s}/')

    # --- Copy static assets ---
    for name in COPY_DIRS:
        src = ROOT / name
        if src.is_dir():
            shutil.copytree(src, OUTPUT / name, dirs_exist_ok=True)
    for name in COPY_FILES:
        src = ROOT / name
        if src.exists():
            shutil.copy2(src, OUTPUT / name)

    # .nojekyll tells GitHub Pages not to run Jekyll
    (OUTPUT / '.nojekyll').touch()

    # --- Generate sitemap.xml ---
    today = datetime.now().strftime('%Y-%m-%d')
    sitemap_entries = []
    for page in PAGES:
        if page['out'] == '404.html':
            continue
        sitemap_entries.append((page['url'], today))
    # Blog index: use the most recent post's last_modified date
    blog_lastmod = posts[0]['last_modified'] if posts else today
    sitemap_entries.append(('/blog', blog_lastmod))
    for post in posts:
        sitemap_entries.append((post['url'], post['last_modified']))

    sitemap_lines = ['<?xml version="1.0" encoding="UTF-8"?>',
                     '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, lastmod in sitemap_entries:
        sitemap_lines.append(f'  <url><loc>{SITE_URL}{url}</loc><lastmod>{lastmod}</lastmod></url>')
    sitemap_lines.append('</urlset>')
    sitemap_lines.append('')
    (OUTPUT / 'sitemap.xml').write_text('\n'.join(sitemap_lines), encoding='utf-8')
    print('  sitemap.xml')

    # --- Generate robots.txt ---
    robots = f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n'
    (OUTPUT / 'robots.txt').write_text(robots, encoding='utf-8')
    print('  robots.txt')

    print(f'\nDone. Output in {OUTPUT}/')


# ---------------------------------------------------------------------------
# Dev server
# ---------------------------------------------------------------------------

def serve(port=8000):
    build()
    # Disable reverse DNS lookups (makes requests much faster)
    SimpleHTTPRequestHandler.address_string = lambda self: self.client_address[0]
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(OUTPUT))
    print(f'\nServing at http://localhost:{port}/')
    HTTPServer(('', port), handler).serve_forever()


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'serve':
        serve()
    else:
        build()
