"""
Download free NCERT textbook PDFs into data/raw/.
Run from the project root:
    python backend/scripts/download_ncert.py
"""
import os
import urllib.request

SAVE_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "raw")

BOOKS = [
    ("math_grade7.pdf",    "https://ncert.nic.in/textbook/pdf/gemh1dd.zip"),
    ("math_grade8.pdf",    "https://ncert.nic.in/textbook/pdf/hemh1dd.zip"),
    ("math_grade9.pdf",    "https://ncert.nic.in/textbook/pdf/iemh1dd.zip"),
    ("math_grade10.pdf",   "https://ncert.nic.in/textbook/pdf/jemh1dd.zip"),
    ("science_grade7.pdf", "https://ncert.nic.in/textbook/pdf/gesc1dd.zip"),
    ("science_grade8.pdf", "https://ncert.nic.in/textbook/pdf/hesc1dd.zip"),
    ("science_grade9.pdf", "https://ncert.nic.in/textbook/pdf/iesc1dd.zip"),
    ("science_grade10.pdf","https://ncert.nic.in/textbook/pdf/jesc1dd.zip"),
]

HEADERS = {"User-Agent": "Mozilla/5.0"}


def download(filename: str, url: str):
    dest = os.path.join(SAVE_DIR, filename)
    if os.path.exists(dest):
        print(f"  [skip] {filename} already exists")
        return
    print(f"  Downloading {filename} ...", end=" ", flush=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
            f.write(r.read())
        print("OK")
    except Exception as e:  # noqa: BLE001
        print(f"FAILED ({e})")
        print(f"    Manual download: {url}")


if __name__ == "__main__":
    os.makedirs(SAVE_DIR, exist_ok=True)
    print(f"Saving PDFs to: {os.path.abspath(SAVE_DIR)}\n")
    for fname, url in BOOKS:
        download(fname, url)
    print("\nDone. Now run:")
    print("  cd backend")
    print("  python scripts/ingest_content.py --pdf_dir ../data/raw/")
