// Minimal headless-Edge driver over the Chrome DevTools Protocol (loopback only, no dependencies).
// Used by the Founder UAT journey verifiers. Nothing here logs tokens, cookies or typed values.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const safePath = (url) => { try { return new URL(url).pathname; } catch { return '?'; } };

export async function openBrowser({ edge, out, viewport = { width: 1440, height: 900, mobile: false } }) {
  const profile = await mkdtemp(path.join(os.tmpdir(), 'nova-verify-edge-'));
  const proc = spawn(edge, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'], { stdio: 'ignore', windowsHide: true });
  let port;
  for (let i = 0; i < 100 && !port; i += 1) {
    try { port = Number((await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split(/\r?\n/)[0]); } catch {}
    if (!port) await pause(100);
  }
  if (!port) throw new Error('browser did not start');
  let targets;
  for (let i = 0; i < 50 && !targets; i += 1) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { await pause(100); } }
  const target = targets?.find((t) => t.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { socket.addEventListener('open', res, { once: true }); socket.addEventListener('error', rej, { once: true }); });
  let nextId = 0; const pending = new Map();
  const diag = { api: [], consoleErrors: 0, exceptions: 0, failedRequests: [], timeline: [], consoleSamples: [] };
  const reqs = new Map();
  socket.addEventListener('message', (event) => {
    const m = JSON.parse(event.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); return; }
    if (m.method === 'Network.requestWillBeSent') {
      reqs.set(m.params.requestId, { method: m.params.request.method, path: safePath(m.params.request.url) });
      if (m.params.request.method === 'POST' && safePath(m.params.request.url) === '/api/v1/auth/login') diag.loginRequestId = m.params.requestId;
    }
    if (m.method === 'Network.responseReceived') { const r = reqs.get(m.params.requestId); if (r && r.path.startsWith('/api/')) diag.api.push(`${r.method} ${r.path} ${m.params.response.status}`); }
    if (m.method === 'Network.loadingFailed') { const r = reqs.get(m.params.requestId); diag.failedRequests.push(`${r?.path ?? '?'} ${m.params.errorText}`); }
    if (m.method === 'Runtime.exceptionThrown') { diag.exceptions += 1; diag.consoleSamples.push(`exception: ${String(m.params.exceptionDetails?.exception?.description ?? m.params.exceptionDetails?.text).slice(0, 160)}`); }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') { diag.consoleErrors += 1; diag.consoleSamples.push(`console.error: ${(m.params.args ?? []).map((a) => String(a.value ?? a.description ?? '')).join(' ').slice(0, 160)}`); }
  });
  const call = (method, params = {}) => new Promise((res, rej) => {
    const id = ++nextId; pending.set(id, { res, rej }); socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pending.delete(id)) rej(new Error(`${method} timed out`)); }, 30000);
  });
  const evaluate = async (expression, awaitPromise = false) => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
    if (r.exceptionDetails) throw new Error(`page evaluation failed: ${String(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text).slice(0, 200)}`);
    return r.result?.value;
  };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
  const state = () => evaluate("({path:location.pathname, hash:location.hash, len:document.body.innerText.length, head:document.body.innerText.slice(0,140).replace(/\\s+/g,' ')})");
  const waitFor = async (label, predicateSrc, timeoutMs = 20000, stepMs = 250) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const s = await state(); diag.timeline.push(`${Math.round((Date.now() - start) / 100) / 10}s ${label} ${s.path}${s.hash} len=${s.len}`);
      let ok = false; try { ok = await evaluate(predicateSrc); } catch {}
      if (ok) return s;
      await pause(stepMs);
    }
    return null;
  };
  const close = async () => { try { socket.close(); } catch {} try { proc.kill(); } catch {} await pause(250); await rm(profile, { recursive: true, force: true }).catch(() => {}); };
  const shot = async (name) => { const s = await call('Page.captureScreenshot', { format: 'png' }); await writeFile(path.join(out, name), Buffer.from(s.data, 'base64')); return name; };
  const loginToken = async () => {
    if (!diag.loginRequestId) return null;
    try { const body = await call('Network.getResponseBody', { requestId: diag.loginRequestId }); return JSON.parse(body.body).access_token ?? null; } catch { return null; }
  };

  // ---- DOM helpers (all run inside the page; values are passed as JSON, never interpolated unescaped)
  const J = JSON.stringify;
  const VISIBLE = "(e)=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'}";
  const dialogRoot = "[...document.querySelectorAll('[role=dialog]')].filter(d=>d.getAttribute('aria-hidden')!=='true').pop()";
  const roots = `[${dialogRoot}, document].filter(Boolean)`;
  /** Click the first visible, enabled control whose trimmed text matches `pattern` (RegExp source). Dialog content wins over page content. */
  const click = (pattern, { within = null, tag = 'button,a,[role=tab],[role=menuitem],[role=option],[role=button],li' } = {}) => evaluate(`(()=>{
    const vis=${VISIBLE}; const re=new RegExp(${J(pattern)},'i'); const roots=${within ? `[document.querySelector(${J(within)})||document]` : roots};
    let el=null; for(const root of roots){ el=[...root.querySelectorAll(${J(tag)})].filter(e=>vis(e)&&!e.disabled&&e.getAttribute('aria-disabled')!=='true'&&re.test((e.innerText||e.getAttribute('aria-label')||'').trim()))[0]; if(el) break; }
    if(!el) return false; el.scrollIntoView({block:'center'}); el.click(); return true; })()`);
  const isDisabled = (pattern) => evaluate(`(()=>{const vis=${VISIBLE};const re=new RegExp(${J(pattern)},'i');let el=null;for(const root of ${roots}){el=[...root.querySelectorAll('button')].find(e=>vis(e)&&re.test((e.innerText||'').trim()));if(el)break}return el?!!el.disabled:null})()`);
  const labelOf = `(el)=>{ if(el.getAttribute('aria-label')) return el.getAttribute('aria-label'); const ids=(el.getAttribute('aria-labelledby')||'').split(' ').filter(Boolean); const t=ids.map(i=>document.getElementById(i)?.innerText||'').join(' ').trim(); if(t) return t; if(el.id){const l=document.querySelector('label[for="'+el.id+'"]'); if(l) return l.innerText;} return el.closest('label')?.innerText||''; }`;
  /** Set a text/textarea/date input found by its label (RegExp source). */
  const type = (labelPattern, value, { nth = 0 } = {}) => evaluate(`(()=>{
    const vis=${VISIBLE}; const lab=${labelOf}; const re=new RegExp(${J(labelPattern)},'i');
    let el=null; for(const root of ${roots}){ const els=[...root.querySelectorAll('input:not([type=checkbox]):not([type=file]),textarea')].filter(e=>vis(e)&&re.test(lab(e))); el=els[${nth}]; if(el) break; }
    if(!el) return false;
    const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${J(value)});
    el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  /** Choose an option of a MUI select found by its label. */
  const select = async (labelPattern, optionPattern) => {
    const opened = await evaluate(`(()=>{ const vis=${VISIBLE}; const lab=${labelOf}; const re=new RegExp(${J(labelPattern)},'i');
      let el=null; for(const root of ${roots}){ el=[...root.querySelectorAll('[role=combobox]')].filter(e=>vis(e)&&re.test(lab(e)))[0]; if(el) break; }
      if(!el) return false;
      el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0})); return true; })()`);
    if (!opened) return false;
    await pause(300);
    const picked = await evaluate(`(()=>{ const re=new RegExp(${J(optionPattern)},'i'); const el=[...document.querySelectorAll('[role=listbox] [role=option]')].find(e=>re.test(e.innerText.trim())); if(!el) return false; el.click(); return true; })()`);
    await pause(250);
    return picked;
  };
  const check = (labelPattern) => evaluate(`(()=>{const vis=${VISIBLE};const lab=${labelOf};const re=new RegExp(${J(labelPattern)},'i');const el=[...document.querySelectorAll('input[type=checkbox]')].find(e=>re.test(lab(e)));if(!el)return false;el.click();return true})()`);
  const text = () => evaluate('document.body.innerText');
  const has = (pattern) => evaluate(`new RegExp(${J(pattern)},'i').test(document.body.innerText)`);
  return { call, evaluate, state, waitFor, close, shot, diag, loginToken, click, type, select, check, text, has, isDisabled, pause };
}
