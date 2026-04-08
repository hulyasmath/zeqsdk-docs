/**
 * zeq-kernel-copy.js — SDK Docusaurus Copy widget
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts a "Copy kernel prompt + API key + agreement" button into any element
 * with id="zeq-kernel-copy-mount". Fetches the canonical kernel prompt from
 *   https://www.zeq.dev/api/kernel/prompt
 * (single source of truth) at runtime, with a build-time inline fallback so
 * the button still works offline / when the API is unreachable.
 *
 * Source of truth: zeqsdk/artifacts/api-server/src/lib/zeqKernel.ts
 *                  → buildKernelPrompt()
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  var KERNEL_URL = 'https://www.zeq.dev/api/kernel/prompt';
  var DEMO_KEY_URL = 'https://www.zeq.dev/api/demo-key';
  var TTL_MS = 5 * 60 * 1000;

  var _prompt = null;
  var _promptAt = 0;
  var _key = 'zeq_ak_demo_request_via_zeq.dev';

  // Build-time inline fallback. Kept short — the canonical /api/kernel/prompt
  // is the real source. This is only used when the fetch fails.
  var INLINE_FALLBACK = [
    'ZEQOND — Physics-as-a-Service   · www.zeq.dev',
    '',
    'BASE URL:  https://www.zeq.dev',
    'API KEY:   __KEY__',
    'DOCS:      https://www.zeq.dev/sdk',
    'KERNEL:    https://www.zeq.dev/api/kernel/prompt  (canonical source of truth)',
    '',
    'POST /api/zeq/compute           → 7-step physics engine',
    'POST /api/mcp                   → Model Context Protocol',
    'GET  /api/operators             → 1,536 verified operators',
    '',
    'COMPUTATION PROTOCOL [7 STEPS]',
    '01 SELECT operator from 1,536 NIST-grounded physics ops',
    '02 BIND   physical constants (NIST CODATA 2018)',
    '03 VALIDATE dimensional analysis + domain constraints',
    '04 COMPUTE FastAPI solver → ≤0.1% precision',
    '05 VERIFY  against KO42 master metric',
    '06 PULSE   synchronise to 1.287 Hz HulyaPulse',
    '07 RETURN  JSON {value, unit, uncertainty, operator_id, equations[], master_sum}',
    '',
    'KO42 IS MANDATORY on every call. Returns must include equations[] and master_sum.',
    'RULE 6 — PARITY CHECK: zeqond variance > 0.0091 → POST /api/zeq/shift to re-align KO42.',
    '',
    'Fetch the full canonical prompt from https://www.zeq.dev/api/kernel/prompt'
  ].join('\n');

  function decorate(prompt) {
    var header = [
      'ZEQOND — Physics-as-a-Service   · www.zeq.dev',
      '',
      'BASE URL:  https://www.zeq.dev',
      'API KEY:   ' + _key,
      'DOCS:      https://www.zeq.dev/sdk',
      'KERNEL:    https://www.zeq.dev/api/kernel/prompt  (canonical source of truth)',
      '',
      '═════════════════════════════════════════════════════════════════',
      '',
      ''
    ].join('\n');
    return header + prompt;
  }

  function fetchPrompt() {
    if (_prompt && (Date.now() - _promptAt) < TTL_MS) return Promise.resolve(_prompt);
    return fetch(KERNEL_URL, { headers: { 'Accept': 'text/plain' } })
      .then(function (r) { if (!r.ok) throw new Error('kernel ' + r.status); return r.text(); })
      .then(function (txt) { _prompt = txt; _promptAt = Date.now(); return txt; });
  }

  function fetchKey() {
    return fetch(DEMO_KEY_URL).then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.key) _key = d.key;
    }).catch(function () {});
  }

  function copySync(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:300px;height:150px;font-size:16px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.setSelectionRange(0, text.length); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    if (ok && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    }
    return ok;
  }

  function mount() {
    var host = document.getElementById('zeq-kernel-copy-mount');
    if (!host) return; if (host.dataset.mounted === '1' && host.children.length > 0) return;
    host.dataset.mounted = '1';
    // Parity with the home page hero copy box: header + warning + scrollable
    // live-rendered <pre> body — visible == copied (single source of truth).
    host.innerHTML =
      '<div style="border:1px solid #00ff88;background:#000;font-family:\'JetBrains Mono\',ui-monospace,monospace;margin:1.5rem 0;border-radius:2px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.55rem 1rem;border-bottom:1px solid #00ff88;">' +
          '<span style="font-size:0.7rem;color:rgba(0,212,255,0.85);letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">ZEQOND API · FASTAPI · REST · MCP · OPEN SCIENCE</span>' +
          '<button id="zeq-kernel-copy-btn" title="Copy API config + full kernel prompt" style="background:#00ff88;border:none;border-radius:3px;color:#000;font-family:inherit;font-size:0.58rem;font-weight:800;letter-spacing:0.1em;padding:0.4rem 0.9rem;cursor:pointer;white-space:nowrap;">⎘ COPY</button>' +
        '</div>' +
        '<div style="padding:0.5rem 1rem;border-bottom:1px solid #00ff88;background:rgba(255,179,0,0.08);">' +
          '<span style="font-size:0.55rem;letter-spacing:0.1em;color:#ffb300;">⚠ 24-HOUR DEMO KEY — RECLAIM DAILY · Subscribers: always-on</span>' +
        '</div>' +
        '<div id="zeq-kernel-copy-body" title="Click anywhere to copy" style="padding:0.75rem 1rem;font-size:0.6rem;line-height:1.5;color:rgba(255,255,255,0.78);max-height:280px;overflow-y:auto;cursor:pointer;">' +
          '<div style="color:#fff;">BASE URL:  <span style="color:#00d4ff;">https://www.zeq.dev</span></div>' +
          '<div style="color:#fff;">API KEY:   <span id="zeq-kernel-copy-key" style="color:#00ff88;font-weight:700;">loading…</span></div>' +
          '<div style="color:#fff;">DOCS:      <span style="color:#00d4ff;">https://www.zeq.dev/sdk</span></div>' +
          '<div style="color:#fff;">KERNEL:    <span style="color:#00d4ff;">https://www.zeq.dev/api/kernel/prompt</span> <span style="color:rgba(255,255,255,0.45);">(source of truth)</span></div>' +
          '<div style="border-top:1px solid rgba(0,255,136,0.25);margin:0.55rem 0;"></div>' +
          '<pre id="zeq-kernel-copy-pre" style="margin:0;white-space:pre-wrap;word-break:break-word;font:inherit;color:rgba(255,255,255,0.82);background:transparent;">Loading canonical kernel from /api/kernel/prompt …</pre>' +
        '</div>' +
        '<div style="padding:0.4rem 1rem;border-top:1px solid #00ff88;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">' +
          '<span style="font-size:0.55rem;color:rgba(0,255,136,0.5);">Full kernel prompt: www.zeq.dev/api/kernel/prompt</span>' +
          '<a href="https://www.zeq.dev/api/kernel/prompt" target="_blank" rel="noopener" style="font-size:0.55rem;color:rgba(0,255,136,0.7);text-decoration:none;white-space:nowrap;">VIEW FULL KERNEL →</a>' +
        '</div>' +
      '</div>';

    // Live-render the kernel prompt body so visible == copied.
    fetchPrompt().then(function (txt) {
      var pre = document.getElementById('zeq-kernel-copy-pre');
      if (pre) pre.textContent = txt;
    }).catch(function () {
      var pre = document.getElementById('zeq-kernel-copy-pre');
      if (pre) pre.textContent = INLINE_FALLBACK.replace('__KEY__', _key);
    });

    // Click-anywhere-on-body to copy.
    var body = document.getElementById('zeq-kernel-copy-body');
    if (body) body.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'zeq-kernel-copy-btn') return;
      var text = (_prompt && (Date.now() - _promptAt) < TTL_MS)
        ? decorate(_prompt)
        : decorate(INLINE_FALLBACK.replace('__KEY__', _key));
      copySync(text);
    });

    var btn = document.getElementById('zeq-kernel-copy-btn');
    var keyEl = document.getElementById('zeq-kernel-copy-key');

    fetchKey().then(function () { if (keyEl) keyEl.textContent = _key; });
    fetchPrompt().catch(function () {});

    btn.addEventListener('click', function () {
      // Clipboard write must run synchronously inside the gesture.
      var text = (_prompt && (Date.now() - _promptAt) < TTL_MS)
        ? decorate(_prompt)
        : decorate(INLINE_FALLBACK.replace('__KEY__', _key));
      // Background refresh for the next click.
      fetchPrompt().catch(function () {});
      var ok = copySync(text);
      btn.textContent = ok ? '✓ COPIED' : '⚠ SELECT';
      setTimeout(function () { btn.textContent = '⎘ COPY'; }, 2000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  // Docusaurus is an SPA — re-mount on route change.
  if (typeof window !== 'undefined') {
    var lastUrl = location.href;
    setInterval(function () {
      if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(mount, 50); } else { var h=document.getElementById("zeq-kernel-copy-mount"); if (h && h.children.length===0) { h.dataset.mounted=""; mount(); } }
    }, 400);
  }
})();
