#!/usr/bin/env python3
"""Translate Docusaurus docs/ markdown into i18n/<locale>/docusaurus-plugin-content-docs/current/.
Preserves code fences, inline code, math, frontmatter keys, URLs, and HTML tags."""
import os, re, sys, time, shutil, hashlib
from deep_translator import GoogleTranslator

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS = os.path.join(ROOT, "docs")
I18N = os.path.join(ROOT, "i18n")
LOCALES = {
    "ar": "ar", "zh-Hans": "zh-CN", "es": "es", "fr": "fr", "de": "de",
    "pt-BR": "pt", "ja": "ja", "ko": "ko", "ru": "ru", "hi": "hi", "it": "it",
}

PLACEHOLDER = "\u241f"  # unit separator — unlikely in content

def protect(text):
    """Replace code blocks, inline code, math, URLs, HTML tags with placeholders."""
    tokens = []
    def stash(m):
        tokens.append(m.group(0))
        return f"{PLACEHOLDER}{len(tokens)-1}{PLACEHOLDER}"
    # fenced code blocks
    text = re.sub(r"```[\s\S]*?```", stash, text)
    # inline code
    text = re.sub(r"`[^`\n]+`", stash, text)
    # math $$...$$ and $...$
    text = re.sub(r"\$\$[\s\S]*?\$\$", stash, text)
    text = re.sub(r"(?<!\$)\$[^\$\n]+\$(?!\$)", stash, text)
    # markdown links/images — keep URL, allow label translation by only stashing the url part
    # raw URLs
    text = re.sub(r"https?://\S+", stash, text)
    # HTML tags
    text = re.sub(r"<[^>\n]+>", stash, text)
    return text, tokens

def restore(text, tokens):
    def repl(m):
        idx = int(m.group(1))
        return tokens[idx] if idx < len(tokens) else m.group(0)
    return re.sub(f"{PLACEHOLDER}(\\d+){PLACEHOLDER}", repl, text)

def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[:end+5], text[end+5:]
    return "", text

def translate_chunks(text, target, cache):
    # split into paragraph chunks to stay under ~4500 chars
    paragraphs = text.split("\n\n")
    out = []
    for p in paragraphs:
        if not p.strip():
            out.append(p); continue
        if len(p) > 4500:
            # split by newline for very long
            lines = p.split("\n")
            tr_lines = []
            for ln in lines:
                tr_lines.append(translate_one(ln, target, cache))
            out.append("\n".join(tr_lines))
        else:
            out.append(translate_one(p, target, cache))
    return "\n\n".join(out)

def translate_one(s, target, cache):
    key = hashlib.md5((target + "::" + s).encode()).hexdigest()
    if key in cache: return cache[key]
    if not s.strip() or re.fullmatch(r"[\s\W\d]+", s):
        cache[key] = s; return s
    for attempt in range(3):
        try:
            out = GoogleTranslator(source="en", target=target).translate(s)
            cache[key] = out or s
            return cache[key]
        except Exception:
            time.sleep(2 + attempt*2)
    cache[key] = s
    return s

def process_file(src, dst, target, cache):
    with open(src, "r", encoding="utf-8") as fh:
        raw = fh.read()
    fm, body = split_frontmatter(raw)
    protected, tokens = protect(body)
    translated = translate_chunks(protected, target, cache)
    translated = restore(translated, tokens)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(dst, "w", encoding="utf-8") as fh:
        fh.write(fm + translated)

def process_locale(locale, target):
    print(f"[{locale}] starting (target={target})", flush=True)
    cache = {}
    out_root = os.path.join(I18N, locale, "docusaurus-plugin-content-docs", "current")
    count = 0; total = 0
    for dp, _, files in os.walk(DOCS):
        for f in files:
            if f.endswith((".md", ".mdx")): total += 1
    for dp, _, files in os.walk(DOCS):
        for f in files:
            if not f.endswith((".md", ".mdx")): continue
            rel = os.path.relpath(os.path.join(dp, f), DOCS)
            dst = os.path.join(out_root, rel)
            if os.path.exists(dst) and os.path.getsize(dst) > 0:
                count += 1
                continue  # resume — skip already-translated
            try:
                process_file(os.path.join(dp, f), dst, target, cache)
            except Exception as e:
                print(f"[{locale}] ERR {rel}: {e}", flush=True)
            count += 1
            if count % 10 == 0:
                print(f"[{locale}] {count}/{total}", flush=True)
    print(f"[{locale}] done {count}/{total}", flush=True)

if __name__ == "__main__":
    only = sys.argv[1:] if len(sys.argv) > 1 else list(LOCALES.keys())
    for loc in only:
        if loc not in LOCALES:
            continue
        process_locale(loc, LOCALES[loc])
