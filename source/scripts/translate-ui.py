#!/usr/bin/env python3
"""Translate Docusaurus UI JSON scaffolds for all non-English locales."""
import json, os, sys, time
from deep_translator import GoogleTranslator

ROOT = os.path.join(os.path.dirname(__file__), "..", "i18n")
LOCALES = {
    "ar": "ar", "zh-Hans": "zh-CN", "es": "es", "fr": "fr", "de": "de",
    "pt-BR": "pt", "ja": "ja", "ko": "ko", "ru": "ru", "hi": "hi", "it": "it",
}

def tr(text, target, cache):
    if not text or not text.strip():
        return text
    if text in cache:
        return cache[text]
    for attempt in range(3):
        try:
            out = GoogleTranslator(source="en", target=target).translate(text)
            cache[text] = out or text
            return cache[text]
        except Exception:
            time.sleep(1 + attempt)
    cache[text] = text
    return text

def walk(obj, target, cache):
    if isinstance(obj, dict):
        if "message" in obj and isinstance(obj["message"], str):
            obj["message"] = tr(obj["message"], target, cache)
            return obj
        return {k: walk(v, target, cache) for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk(x, target, cache) for x in obj]
    return obj

def process_locale(locale, target):
    print(f"[{locale}] starting", flush=True)
    cache = {}
    base = os.path.join(ROOT, locale)
    for dp, _, files in os.walk(base):
        if "docusaurus-plugin-content-docs/current" in dp.replace("\\", "/"):
            continue
        for f in files:
            if not f.endswith(".json"):
                continue
            path = os.path.join(dp, f)
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)
            new = walk(data, target, cache)
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(new, fh, ensure_ascii=False, indent=2)
    print(f"[{locale}] done ({len(cache)} strings)", flush=True)

if __name__ == "__main__":
    only = sys.argv[1:] if len(sys.argv) > 1 else list(LOCALES.keys())
    for loc in only:
        if loc not in LOCALES:
            continue
        process_locale(loc, LOCALES[loc])
