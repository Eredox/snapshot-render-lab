// Website-side booking-confirmation, history-state and responsive checks against a LOCAL build: SITE=http://127.0.0.1:PORT node scripts/journey/site-journey.mjs. /api/forms is stubbed in the page; nothing is sent.
import { openBrowser, pause } from './cdp-browser.mjs';
import os from 'node:os';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const SITE = (process.env.SITE || 'http://127.0.0.1:5193').replace(/\/$/, '');
const EDGE = process.env.NOVA_VERIFY_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.join(os.tmpdir(), 'nova-site-journey');
await mkdir(OUT, { recursive: true });
let fails = 0;
const step = (n, ok, d = '') => { if (!ok) fails += 1; console.log(`${ok ? 'PASS' : 'FAIL'} ${n}${d ? ' :: ' + d : ''}`); };

const b = await openBrowser({ edge: EDGE, out: OUT });
const go = async (p, ready = 'true') => { await b.call('Page.navigate', { url: SITE + p }); await pause(700); return b.waitFor('load ' + p, `document.body && document.body.innerText.length>40 && ${ready}`, 15000); };
const NAME = 'Zed Disposable', EMAIL = 'zed.disposable@example.test', CO = 'Disposable Pty Ltd';
const stub = (status) => b.evaluate(`(()=>{ if(!window.__orig){window.__orig=window.fetch;} window.fetch=(u,o)=>String(u).includes('/api/forms')?Promise.resolve(new Response('{"ok":true}',{status:${status},headers:{'content-type':'application/json'}})):window.__orig(u,o); return true; })()`);
const setVal = (id, v) => b.evaluate(`(()=>{const el=document.getElementById(${JSON.stringify(id)}); if(!el) return false; const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true;})()`);
const fillBooking = async () => {
  const d = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);
  const opt = (id) => b.evaluate(`[...document.getElementById(${JSON.stringify(id)}).options].filter(o=>!o.disabled).map(o=>o.value)[0]`);
  await setVal('booking-name', NAME); await setVal('booking-email', EMAIL); await setVal('booking-company', CO);
  await setVal('booking-framework', await opt('booking-framework')); await setVal('booking-team', await opt('booking-team'));
  await setVal('booking-date', d); await setVal('booking-time', '10:30');
};
const submit = () => b.evaluate("(()=>{const f=document.querySelector('form'); const btn=[...f.querySelectorAll('button')].find(x=>x.type==='submit'||/book|submit|request/i.test(x.innerText)); btn.click(); return btn.innerText;})()");
const state = () => b.evaluate("({path:location.pathname,search:location.search,hash:location.hash,txt:document.body.innerText})");
const noPiiInUrl = (s) => !/zed|disposable|example\.test|%40|@/i.test(s.path + s.search + s.hash);

try {
  // J1 direct link / new tab
  await go('/book-demo/confirmed', "/demo request is in/i.test(document.body.innerText)");
  let s = await state();
  step('J1 direct load of /book-demo/confirmed shows generic page, no PII', /Your demo request is in/.test(s.txt) && !s.txt.includes(NAME) && !s.txt.includes(EMAIL) && s.search === '');
  // J2 submit through the real BookingForm (fetch stubbed)
  await go('/book-demo', "!!document.getElementById('booking-name')"); await pause(2500);
  await stub(202); await fillBooking(); await submit();
  await b.waitFor('confirmed', "location.pathname==='/book-demo/confirmed'", 10000); await pause(600);
  s = await state();
  step('J2 submit lands on /book-demo/confirmed with a clean URL', s.path === '/book-demo/confirmed' && s.search === '' && s.hash === '' && noPiiInUrl(s), s.path + s.search);
  step('J2 details shown from history state', s.txt.includes(NAME) && s.txt.includes(EMAIL) && s.txt.includes(CO));
  step('J2 history.state holds details; URL never does', await b.evaluate(`JSON.stringify(history.state||{}).includes(${JSON.stringify(EMAIL)})`) === true && noPiiInUrl(s));
  const perfUrls = await b.evaluate("performance.getEntries().map(e=>e.name).join('\\n')");
  step('J2 no PII in any resource URL requested by the page', !/zed|example\.test|%40/i.test(perfUrls));
  // J3 refresh
  await b.call('Page.reload', {}); await pause(1500); await b.waitFor('reloaded', "document.body.innerText.length>40", 12000); await pause(800);
  s = await state();
  const survivesReload = s.txt.includes(EMAIL);
  step('J3 refresh keeps confirmation details (history.state survives reload in same tab)', survivesReload, survivesReload ? 'details present' : 'details lost -> generic page shown');
  step('J3 refresh never exposes details in URL', noPiiInUrl(s) && s.search === '');
  // J4 navigate away and back
  await b.evaluate("(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.getAttribute('href')==='/pricing'); a && a.click(); return !!a;})()");
  await b.waitFor('pricing', "location.pathname==='/pricing'", 8000);
  await b.evaluate('history.back()'); await b.waitFor('back', "location.pathname==='/book-demo/confirmed'", 8000); await pause(800);
  s = await state();
  step('J4 back from /pricing restores confirmation details', s.txt.includes(EMAIL), s.path);
  // J5 forward/back to the form: form values are not persisted (privacy) but page works
  await b.evaluate('history.back()'); await pause(1200); s = await state();
  step('J5 back to /book-demo works and form is usable', s.path === '/book-demo' && /Name/.test(s.txt));
  // J6 failed submission recovers
  await go('/book-demo', "!!document.getElementById('booking-name')"); await pause(2500);
  await stub(502); await fillBooking(); await submit(); await pause(1500); s = await state();
  step('J6 failed delivery (502) keeps visitor on form with an error message', s.path === '/book-demo' && /could not send your booking/i.test(s.txt));
  step('J6 entered values preserved after failure', (await b.evaluate("document.getElementById('booking-email').value")) === EMAIL);
  await stub(202); await submit(); await b.waitFor('retry', "location.pathname==='/book-demo/confirmed'", 8000); s = await state();
  step('J6 retry after failure succeeds', s.path === '/book-demo/confirmed' && s.txt.includes(EMAIL));
  // J7 spoofed/oversized state is bounded
  await b.evaluate("history.replaceState({bookingConfirmation:{name:'<img src=x onerror=alert(1)>',email:'x'.repeat(1000),company:'c',framework:'',teamSize:'',date:'not-a-date',timeSlot:'zz'}}, '')");
  await b.call('Page.reload', {}); await pause(1500); await b.waitFor('reloaded2', "document.body.innerText.length>40", 12000); await pause(800);
  s = await state();
  step('J7 hostile history.state is rendered as text only and bounded', !(await b.evaluate("!!document.querySelector('main img[src=x]')")) && !s.txt.includes('x'.repeat(300)));
  // J8 contact form invalid / honeypot unaffected on reload (page loads)
  await go('/contact', "true"); step('J8 /contact loads', true);

  // ---- Responsive: desktop / tablet / mobile
  const pages = ['/', '/pricing', '/plans/growth', '/platform', '/frameworks', '/frameworks/iso-27001', '/book-demo', '/contact', '/start', '/compare', '/customers', '/security'];
  const vps = [['desktop', 1440, 900, false], ['laptop', 1280, 800, false], ['tablet', 820, 1180, false], ['tablet-landscape', 1024, 768, false], ['mobile', 390, 844, true]];
  for (const [name, w, h, mobile] of vps) {
    await b.call('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    let over = [];
    for (const p of pages) {
      await go(p, 'true'); await pause(500);
      const r = await b.evaluate("({over: document.documentElement.scrollWidth > window.innerWidth + 1, sw: document.documentElement.scrollWidth, h1: !!document.querySelector('h1'), small: [...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&(r.height<24||r.width<24)&&!e.closest('p,li,span')?.matches('p')}).length})");
      if (r.over || !r.h1) over.push(`${p}(${r.sw}${r.h1 ? '' : ',noH1'})`);
    }
    step(`R ${name} ${w}px: no horizontal overflow and an H1 on ${pages.length} pages`, over.length === 0, over.join(' '));
    // nav behaviour
    await go('/', 'true'); await pause(600);
    const nav = await b.evaluate("(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}; const btn=[...document.querySelectorAll('header button')].find(x=>vis(x)&&/menu|navigation/i.test((x.getAttribute('aria-label')||'')+x.innerText)); return {hasToggle:!!btn, label: btn?(btn.getAttribute('aria-label')||btn.innerText):null, desktopLinks:[...document.querySelectorAll('header a')].filter(vis).length};})()");
    if (w < 1280) {
      step(`R ${name} header menu toggle present`, nav.hasToggle, JSON.stringify(nav));
      if (nav.hasToggle) {
        await b.evaluate("(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}; [...document.querySelectorAll('header button')].find(x=>vis(x)&&/menu|navigation/i.test((x.getAttribute('aria-label')||'')+x.innerText)).click();})()");
        await pause(500);
        const open = await b.evaluate("({links:[...document.querySelectorAll('a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>=0&&r.top<window.innerHeight}).map(e=>e.getAttribute('href')).filter(h=>h==='/pricing'||h==='/book-demo'||h==='/platform'), over: document.documentElement.scrollWidth>window.innerWidth+1})");
        step(`R ${name} menu opens and shows primary links without overflow`, open.links.length >= 2 && !open.over, JSON.stringify(open));
        await b.evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
      }
    } else step(`R ${name} desktop nav links visible`, nav.desktopLinks >= 4, JSON.stringify(nav));
    await b.shot(`home-${name}.png`);
  }
  console.log(`DIAG consoleErrors=${b.diag.consoleErrors} exceptions=${b.diag.exceptions} failed=${b.diag.failedRequests.length}`);
  b.diag.consoleSamples.slice(0, 5).forEach((x) => console.log('  ' + x.slice(0, 200)));
} catch (e) { fails += 1; console.log('ERROR ' + e.message); }
finally { await b.close(); }
console.log(fails ? `RESULT FAIL (${fails})` : 'RESULT PASS');
process.exit(fails ? 1 : 0);
