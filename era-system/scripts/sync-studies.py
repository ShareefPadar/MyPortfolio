#!/usr/bin/env python3
"""
Pulls the 9 case studies from the live site into content/studies/<project id>.json.

The live site is the source of truth for 1995 — re-run this whenever a case study
changes on shareefpadar.com. Extraction logic: scripts/lib/extract-study.js (runs in the
page). This script normalises the result:
  - all-caps labels → sentence case (eras capitalise with CSS; content stays normal case)
  - Next.js image-resizer URLs (/_next/image?url=…) → the original /assets/… path
  - keeps the page's share image (og:image) for the share preview

Usage:  python3 scripts/sync-studies.py            (needs: pip install playwright && playwright install chromium)
"""
import asyncio, json, os, re, urllib.parse
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = open(os.path.join(ROOT, 'scripts', 'lib', 'extract-study.js')).read()
SLUGS = {'freelax': 'freelax', 'sanad': 'sanad', 'wio': 'wio', 'almosafer-audit': 'almosafer', 'google-maps-route-pass': 'google-maps',
         'omni-cast-ai': 'omnicast', 'instagram-local': 'instagram', 'roomy': 'roomy', 'form': 'form'}

def sc(t):
    return t[:1].upper() + t[1:].lower() if t and t.upper() == t and re.search('[A-Z]', t) else t

def real_src(s):
    if s.startswith('/_next/image'):
        return urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlparse(s).query)['url'][0])
    return s

def convert(slug, pid, d):
    h = d['head']; h['label'] = sc(h['label'])
    for b in d['blocks']:
        if b['type'] == 'short': b['tab'] = sc(b['tab']); b['note'] = sc(b['note']); [r.update(k=sc(r['k'])) for r in b['rows']]
        if b['type'] in ('callout', 'prototype'): b['label'] = sc(b['label'])
        for i in b.get('images', []) + (b['items'] if b['type'] == 'gallery' else []): i['src'] = real_src(i['src'])
        if b['type'] == 'gallery': [i.update(label=sc(i['label'])) for i in b['items']]
    ending = None
    if d['ending']:
        e = d['ending'][0]; t = e['text']
        ending = {'number': t[0], 'heading': sc(t[1]), 'text': t[2], 'links': [{'label': sc(l['label']), 'href': l['href']} for l in e['links']]}
    return {'_source': f'https://www.shareefpadar.com/work/{slug} — extracted from the live DOM by scripts/sync-studies.py',
            'id': pid, 'slug': slug, 'url': f'/work/{slug}', 'pageTitle': d['title'], 'description': d['description'], 'ogImage': d['ogImage'],
            'head': h, 'blocks': d['blocks'], 'ending': ending,
            'next': {'label': sc(d['next']['label']), 'title': d['next']['title'], 'href': d['next']['href']},
            'progressSegments': d['progressSegments']}

async def main():
    out = os.path.join(ROOT, 'content', 'studies'); os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for slug, pid in SLUGS.items():
            pg = await b.new_page(viewport={'width': 1280, 'height': 900})
            await pg.goto(f'https://www.shareefpadar.com/work/{slug}', wait_until='networkidle', timeout=60000); await pg.wait_for_timeout(800)
            h = await pg.evaluate('document.documentElement.scrollHeight')
            for y in range(0, h, 700): await pg.evaluate(f'scrollTo(0,{y})'); await pg.wait_for_timeout(70)   # lazy figures render on scroll
            await pg.wait_for_timeout(500)
            d = await pg.evaluate(JS); await pg.close()
            if d['unknown']: print(f'  ⚠ {slug}: unrecognised blocks — extend extract-study.js:', d['unknown'])
            json.dump(convert(slug, pid, d), open(os.path.join(out, f'{pid}.json'), 'w'), indent=1, ensure_ascii=False)
            print(f'✓ {pid:12s} {len(d["blocks"]):>3} blocks')
        await b.close()

asyncio.run(main())
