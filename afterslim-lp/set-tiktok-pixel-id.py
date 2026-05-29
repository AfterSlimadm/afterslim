#!/usr/bin/env python3
"""
Replace the TIKTOK_PIXEL_ID_PLACEHOLDER in every production page with the real
TikTok Pixel ID, once you have it from Events Manager.

Usage:
    python set-tiktok-pixel-id.py C9XXXXXXXXXXXXXXXXXX

Re-runnable: if pages already carry a real id you can pass the new one and it
replaces the previous value too (matches the ttq.load('...') argument).
"""
import os
import re
import sys

PLACEHOLDER = "TIKTOK_PIXEL_ID_PLACEHOLDER"
# matches ttq.load('<anything>')
LOAD_RE = re.compile(r"ttq\.load\('([^']*)'\)")


def find_pages(root="."):
    pages = []
    for dirpath, _dirs, files in os.walk(root):
        if "node_modules" in dirpath:
            continue
        for f in files:
            if f == "index.html":
                pages.append(os.path.join(dirpath, f))
    return sorted(pages)


def main():
    if len(sys.argv) != 2 or not sys.argv[1].strip():
        print("Usage: python set-tiktok-pixel-id.py <PIXEL_ID>")
        sys.exit(1)
    pixel_id = sys.argv[1].strip()

    changed = []
    for path in find_pages():
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        if "TiktokAnalyticsObject" not in html:
            continue
        new_html = html.replace(PLACEHOLDER, pixel_id)
        new_html = LOAD_RE.sub("ttq.load('" + pixel_id + "')", new_html)
        if new_html != html:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new_html)
            changed.append(path)

    print(f"Set pixel id '{pixel_id}' in {len(changed)} pages.")
    for p in changed:
        print("  *", p)
    print("\nReminder: also set TIKTOK_PIXEL_ID and TIKTOK_ACCESS_TOKEN in the")
    print("afterslim-admin Vercel project env for the server-side Events API.")


if __name__ == "__main__":
    main()
