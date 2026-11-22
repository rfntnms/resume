"""Run after export with pypdf installed: python3 tests/check_print.py PDF..."""
import json
from pathlib import Path
import re
import sys
from pypdf import PdfReader

baseline = json.loads((Path(__file__).parent / 'fixtures/content-baseline.json').read_text())
def normalized(text):
    return re.sub(r'\s+', ' ', text.replace('↗', '')).strip().casefold()

for name in sys.argv[1:]:
    pdf = PdfReader(name)
    assert 1 <= len(pdf.pages) <= 2, f'{name}: expected 1–2 pages, got {len(pdf.pages)}'
    text = normalized(' '.join(page.extract_text() for page in pdf.pages))
    for group in ['jobs', 'skills', 'credentials', 'education', 'projects', 'contact']:
        for fact in baseline[group]:
            assert normalized(fact) in text, f'{name}: missing {group}: {fact}'
    assert text.index('experience') < text.index('selected projects'), 'Experience must precede projects'
    print(f'{name}: {len(pdf.pages)} pages, all source facts extract, experience precedes projects')
