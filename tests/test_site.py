import json
import os
from pathlib import Path
import re
import unittest
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT = Path(os.environ.get('SITE_ROOT', 'dist')).resolve()
BASELINE = json.loads((Path(__file__).parent / 'fixtures/content-baseline.json').read_text())

def normal(value):
    return re.sub(r'\s+', ' ', value.replace('↗', '')).strip()

class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.text, self.tags, self.ids, self.links, self.scripts = [], [], set(), [], []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        self.tags.append((tag, data))
        if 'id' in data:
            self.ids.add(data['id'])
        for key in ['href', 'src']:
            if key in data:
                self.links.append(data[key])

    def handle_data(self, data):
        self.text.append(data)

class SiteContracts(unittest.TestCase):
    def test_complete_resume_facts_in_both_views(self):
        for route in ['index.html', 'resume/index.html']:
            with self.subTest(route=route):
                path = ROOT / route
                self.assertTrue(path.exists(), f'Missing complete resume view: {route}')
                if not path.exists():
                    continue
                text = normal(' '.join(Document(path).text))
                for group in ['jobs', 'skills', 'credentials', 'education', 'projects', 'contact']:
                    for fact in BASELINE[group]:
                        self.assertIn(normal(fact), text, f'Lost {group} fact on {route}: {fact}')

    def test_selected_work_is_primary_action(self):
        doc = Document(ROOT / 'index.html')
        self.assertIn('View selected work', normal(' '.join(doc.text)))
        self.assertTrue(any(t == 'a' and a.get('href') == '/resume/' for t, a in doc.tags))

    def test_case_study_narratives_are_preserved(self):
        for route, facts in BASELINE['caseNarratives'].items():
            text = normal(' '.join(Document(ROOT / route.lstrip('/') / 'index.html').text))
            for fact in facts:
                self.assertIn(normal(fact), text, f'Lost case-study fact on {route}: {fact}')

    def test_existing_routes_anchors_and_metadata(self):
        for route in BASELINE['routes'] + ['/resume/']:
            path = ROOT / route.lstrip('/') / 'index.html'
            with self.subTest(route=route):
                self.assertTrue(path.exists(), f'Missing route {route}')
                if not path.exists():
                    continue
                doc = Document(path)
                self.assertTrue(any(t == 'link' and a.get('rel') == 'canonical' and a.get('href') == 'https://buburtech.com' + route for t, a in doc.tags))
                self.assertTrue(any(t == 'meta' and a.get('name') == 'description' for t, a in doc.tags))
                self.assertEqual(sum(t == 'h1' for t, _ in doc.tags), 1)
        self.assertTrue(set(BASELINE['anchors']) <= Document(ROOT / 'index.html').ids)

    def test_all_local_assets_links_and_jsonld_resolve(self):
        for path in ROOT.rglob('*.html'):
            doc = Document(path)
            for href in doc.links:
                parts = urlsplit(href)
                if parts.scheme or parts.netloc or not parts.path:
                    continue
                target = ROOT / unquote(parts.path.lstrip('/')) if parts.path.startswith('/') else path.parent / unquote(parts.path)
                if target.is_dir():
                    target /= 'index.html'
                self.assertTrue(target.exists(), f'{path}: missing {href}')
                if parts.fragment and target.suffix == '.html' and target.exists():
                    self.assertIn(unquote(parts.fragment), Document(target).ids)
            for block in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', path.read_text(), re.S):
                self.assertIsInstance(json.loads(block), (dict, list))

if __name__ == '__main__':
    unittest.main()
