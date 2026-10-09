import os, zipfile, glob, shutil, sys

raw = r'd:\Coding\Intership Project\IBM\data\raw'
sys.stdout.reconfigure(encoding='utf-8')

# Re-download ZIPs since we already extracted only chapter 1 from each
import urllib.request

BOOKS = [
    ("math_grade7",    "https://ncert.nic.in/textbook/pdf/gemh1dd.zip"),
    ("math_grade8",    "https://ncert.nic.in/textbook/pdf/hemh1dd.zip"),
    ("math_grade9",    "https://ncert.nic.in/textbook/pdf/iemh1dd.zip"),
    ("math_grade10",   "https://ncert.nic.in/textbook/pdf/jemh1dd.zip"),
    ("science_grade7", "https://ncert.nic.in/textbook/pdf/gesc1dd.zip"),
    ("science_grade8", "https://ncert.nic.in/textbook/pdf/hesc1dd.zip"),
    ("science_grade9", "https://ncert.nic.in/textbook/pdf/iesc1dd.zip"),
    ("science_grade10","https://ncert.nic.in/textbook/pdf/jesc1dd.zip"),
]

HEADERS = {"User-Agent": "Mozilla/5.0"}

for prefix, url in BOOKS:
    zip_path = os.path.join(raw, prefix + '.zip')
    print(f'Downloading {prefix}.zip ...', flush=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as r, open(zip_path, 'wb') as f:
            f.write(r.read())
        print(f'  Downloaded {os.path.getsize(zip_path)//1024} KB', flush=True)

        with zipfile.ZipFile(zip_path) as z:
            pdfs = [m for m in z.namelist() if m.lower().endswith('.pdf')
                    and 'ps' not in m and 'an' not in m]  # skip prelim/answer sheets
            print(f'  Extracting {len(pdfs)} chapter PDFs...', flush=True)
            for member in pdfs:
                chapter_name = f"{prefix}_ch{os.path.basename(member)}"
                dest = os.path.join(raw, chapter_name)
                with z.open(member) as src, open(dest, 'wb') as dst:
                    dst.write(src.read())
            print(f'  Done -> {len(pdfs)} files', flush=True)

        os.remove(zip_path)
        # remove the single-chapter file we extracted before
        old = os.path.join(raw, prefix + '.pdf')
        if os.path.exists(old):
            os.remove(old)

    except Exception as e:
        print(f'  FAILED: {e}', flush=True)

print('\nAll done.', flush=True)
files = [f for f in os.listdir(raw) if f.endswith('.pdf')]
print(f'Total PDFs in data/raw: {len(files)}', flush=True)
