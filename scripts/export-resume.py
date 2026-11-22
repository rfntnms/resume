"""Export the built resume, using local assets and the site's print stylesheet.

Requires tools/requirements-print.txt and Pango. Run after npm run build.
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse
from weasyprint import HTML, CSS
from weasyprint.urls import URLFetcher

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'

class LocalAssets(URLFetcher):
    def fetch(self, url, headers=None):
        parsed = urlsplit(url)
        if parsed.scheme == 'data':
            return super().fetch(url, headers)
        if parsed.scheme == 'file':
            absolute = Path(unquote(parsed.path)).resolve()
            path = absolute if absolute.is_relative_to(dist.resolve()) else dist / unquote(parsed.path.lstrip('/'))
        elif parsed.hostname == 'buburtech.com':
            path = dist / unquote(parsed.path.lstrip('/'))
        else:
            raise ValueError(f'Unexpected external asset: {parsed.hostname}')
        path = path.resolve()
        if not path.is_relative_to(dist.resolve()):
            raise ValueError('Asset is outside build directory')
        return super().fetch(path.as_uri(), headers)

parser = argparse.ArgumentParser()
parser.add_argument('--size', choices=['A4', 'Letter'], default='A4')
parser.add_argument('--output', type=Path, default=root / 'public/resume.pdf')
args = parser.parse_args()
source = dist / 'resume/index.html'
if not source.exists():
    raise SystemExit('Run npm run build before exporting the resume.')
args.output.parent.mkdir(parents=True, exist_ok=True)
HTML(string=source.read_text(), base_url='https://buburtech.com/resume/', url_fetcher=LocalAssets(fail_on_errors=True)).write_pdf(
    args.output,
    stylesheets=[CSS(string=f'@page {{ size: {args.size}; margin: 12mm; }}')],
)
print(args.output)
