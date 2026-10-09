"""
Run once to ingest curriculum PDFs into ChromaDB.
Usage (from backend/ folder):
    python scripts/ingest_content.py --pdf_dir ../data/raw/
"""
import argparse
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.config import settings  # noqa: E402
from langchain_community.document_loaders import PyPDFLoader  # noqa: E402
from langchain_community.vectorstores import Chroma  # noqa: E402
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # noqa: E402
from langchain_text_splitters import RecursiveCharacterTextSplitter  # noqa: E402


def ingest(pdf_dir: str):
    pdf_files = list(set(
        glob.glob(f"{pdf_dir}/**/*.pdf", recursive=True) +
        glob.glob(f"{pdf_dir}/*.pdf")
    ))

    if not pdf_files:
        print(f"[!] No PDFs found in '{pdf_dir}'")
        print("    Download NCERT PDFs from https://ncert.nic.in/textbook.php")
        print(f"    and place them in:  {os.path.abspath(pdf_dir)}")
        return

    print(f"[+] Found {len(pdf_files)} PDF(s)")
    docs = []
    for path in pdf_files:
        print(f"    Loading: {os.path.basename(path)}")
        try:
            docs.extend(PyPDFLoader(path).load())
        except Exception as e:  # noqa: BLE001
            print(f"    [!] Skipped (error): {e}")

    if not docs:
        print("[!] No pages loaded. Check PDF files are not corrupted.")
        return

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)
    print(f"[+] Created {len(chunks)} chunks from {len(docs)} pages")

    print("[+] Generating embeddings and saving to ChromaDB...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.langchain_embedding_model,
        google_api_key=settings.google_api_key,
    )
    Chroma.from_documents(chunks, embeddings, persist_directory=settings.chroma_db_path)
    print(f"[+] Done! Embeddings saved to: {settings.chroma_db_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest NCERT PDFs into ChromaDB")
    parser.add_argument("--pdf_dir", default="../data/raw/", help="Folder containing PDF files")
    args = parser.parse_args()
    ingest(args.pdf_dir)
