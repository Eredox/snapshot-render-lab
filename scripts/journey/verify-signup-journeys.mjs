// Source: NOVA application repo scripts/dev/uat-verify (read-only journey verifier), copied for reuse (header comment edited only). Never submits a form, signs in or pays.
// NOVA_APP_URL=https://nova.eredox.com NOVA_SITE_URL=http://127.0.0.1:PORT node scripts/journey/verify-signup-journeys.mjs [--mobile]  (do NOT pass --idp-banner in release checks)
//
//   NOVA_APP_URL=https://nova.eredox.com NOVA_SITE_URL=https://www.nova.eredox.com \
//   node scripts/dev/uat-verify/verify-signup-journeys.mjs [--mobile] [--idp-banner]
//
// --idp-banner additionally presses "Sign in with Eredox" on /login (no credentials are entered) and reports
// whether the identity-provider page shows the Auth0 development-keys warning. Exit code 1 if any step FAILs.
import os from 'node:os';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { openBrowser, pause } from './cdp-browser.mjs';

const APP = (process.env.NOVA_APP_URL || 'http://127.0.0.1:3002').replace(/\/$/, '');
const SITE = (process.env.NOVA_SITE_URL || 'http://127.0.0.1:5180').replace(/\/$/, '');
const EDGE = process.env.NOVA_VERIFY_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = process.env.NOVA_VERIFY_OUT || path.join(os.tmpdir(), 'nova-signup-verify');
const mobile = process.argv.includes('--mobile');
const idpBanner = process.argv.includes('--idp-banner');
await mkdir(OUT, { recursive: true });

const PLANS = [
  { id: 'free', name: 'Free', label: 'Create Free Workspace' },
  { id: 'launch', name: 'Launch', label: 'Subscribe to Launch' },
  { id: 'growth', name: 'Growth', label: 'Subscribe to Growth' },
  { id: 'professional', name: 'Professional', label: 'Subscribe to Professional' },
  { id: 'business', name: 'Business', label: 'Subscribe to Business' },
];
const TRIAL = '(free trial|start your free|trial offer|trial period)';

let failures = 0;
let seen = ''; // what the browser showed after the last navigation, printed with any FAIL
const step = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`STEP ${name} ${ok ? 'PASS' : 'FAIL'} ${detail || (ok ? '' : `[page: ${seen}]`)}`);
  return ok;
};

const b = await openBrowser({ edge: EDGE, out: OUT, viewport: mobile ? { width: 375, height: 812, mobile: true } : undefined });
const go = async (url, ready) => {
  let state = null;
  for (let attempt = 0; attempt < 2 && !state; attempt += 1) { // one retry: a dev server can serve a blank page while it re-optimises
    await b.call('Page.navigate', { url });
    await pause(800); // document.body is briefly null while the navigation commits
    state = await b.waitFor(`load ${url}`, `document.body && document.body.innerText.length > 40 && ${ready}`, attempt ? 20000 : 12000);
  }
  seen = await b.evaluate("location.pathname+location.search+' | '+document.body.innerText.slice(0,120).replace(/\\s+/g,' ')").catch(() => '?');
  return state;
};
// Link text is the first line only: external links append a screen-reader "(opens ... in a new tab)" line.
const anchors = () => b.evaluate("[...document.querySelectorAll('a')].map(a=>({t:(a.innerText||'').trim().split('\\n')[0].trim(),h:a.href}))");
const overflows = () => b.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1');
const view = mobile ? 'mobile' : 'desktop';

try {
  // ---- Website pricing cards: label and destination for each plan, monthly then annual
  for (const cycle of ['monthly', 'annual']) {
    const loaded = await go(`${SITE}/pricing`, 'true');
    if (!step(`site pricing ${cycle} ${view} loads`, !!loaded)) continue;
    if (cycle === 'annual') await b.click('^annual$');
    await pause(500);
    const links = await anchors();
    for (const p of PLANS) {
      const want = `register?plan=${p.id}&billing_cycle=${p.id === 'free' ? 'monthly' : cycle}`;
      const hit = links.find((l) => l.t === p.label && l.h.includes(want));
      step(`site pricing ${cycle} ${p.name} button+link`, !!hit, hit ? hit.h : `no "${p.label}" link to ${want}`);
    }
    const quote = links.find((l) => l.t === 'Request a Quote' && l.h.includes('/request-quote?plan=enterprise'));
    step(`site pricing ${cycle} Enterprise Request a Quote`, !!quote, quote?.h ?? 'missing');
    step(`site pricing ${cycle} no trial wording`, !(await b.has(TRIAL)));
    step(`site pricing ${cycle} no AUD or outdated framework caps`, !(await b.has('\\bAUD\\b|\\b[13] frameworks?\\b')));
    if (mobile) step(`site pricing ${cycle} no horizontal overflow`, !(await overflows()));
  }

  // ---- Application register pages (read-only)
  for (const p of PLANS) {
    for (const cycle of p.id === 'free' ? ['monthly'] : ['monthly', 'annual']) {
      const url = `${APP}/register?plan=${p.id}&billing_cycle=${cycle}`;
      const ready = p.id === 'free' ? "/Create your Free workspace/i.test(document.body.innerText)" : `/Subscribe to ${p.name}/.test(document.body.innerText)`;
      const ok = await go(url, ready);
      if (!step(`app register ${p.name} ${cycle} ${view} loads`, !!ok)) continue;
      const button = p.id === 'free' ? p.label : `Continue to subscribe to ${p.name}`;
      step(`app register ${p.name} ${cycle} button "${button}"`,
        await b.evaluate(`[...document.querySelectorAll('button')].some(x=>x.innerText.trim()===${JSON.stringify(button)})`));
      if (p.id !== 'free') step(`app register ${p.name} ${cycle} states billing interval`, await b.has(`${p.name} with ${cycle} billing`));
      step(`app register ${p.name} ${cycle} no trial wording`, !(await b.has(TRIAL)));
      if (mobile) step(`app register ${p.name} ${cycle} no horizontal overflow`, !(await overflows()));
    }
  }

  // ---- Enterprise is a quotation, never a form
  await go(`${APP}/register?plan=enterprise&billing_cycle=annual`, "/arranged by quotation/i.test(document.body.innerText)");
  step('app register Enterprise quotation page', await b.has('Enterprise is arranged by quotation'));
  step('app register Enterprise has Request a Quote link', (await anchors()).some((l) => l.t === 'Request a Quote' && l.h.includes('request-quote?plan=enterprise')));
  step('app register Enterprise has no sign-up form', !(await b.has('Work email')));

  // ---- Malformed selections never become a Free registration
  for (const q of ['plan=growth', 'plan=growth&billing_cycle=weekly', 'plan=gold&billing_cycle=monthly', 'billing_cycle=annual', 'plan=Growth&billing_cycle=annual']) {
    await go(`${APP}/register?${q}`, '/(could not read your plan|Create your Free workspace|Subscribe to)/i.test(document.body.innerText)');
    step(`app register ?${q} stops instead of Free`, (await b.has('could not read your plan selection')) && !(await b.has('Work email')));
  }
  await go(`${APP}/register`, "/Create your Free workspace/i.test(document.body.innerText)");
  step('app register with no selection is the explicit Free form', await b.has('Work email'));

  // ---- Returning-user sign-in notices
  await go(`${APP}/login?plan=growth&billing_cycle=annual`, "/Sign in/i.test(document.body.innerText)");
  step('app login Growth annual notice', await b.has('You selected Growth with annual billing. Sign in to review your order.'));
  await go(`${APP}/login?plan=free&billing_cycle=monthly`, "/Sign in/i.test(document.body.innerText)");
  step('app login Free notice', await b.has('You selected the Free plan. Sign in to continue to your Free workspace.'));
  await go(`${APP}/login?plan=gold&billing_cycle=monthly`, "/Sign in/i.test(document.body.innerText)");
  step('app login unreadable selection warns', await b.has('We could not read the plan you selected'));

  // ---- Optional: identity-provider page (presses the SSO button only; no credentials are entered)
  if (idpBanner) {
    await go(`${APP}/login`, "/Sign in with Eredox/i.test(document.body.innerText)");
    await b.click('^sign in with eredox$');
    const left = await b.waitFor('idp page', `location.origin !== ${JSON.stringify(new URL(APP).origin)} && document.body.innerText.length > 20`, 25000);
    step('idp page reached', !!left);
    step('idp page shows no development-keys warning', !(await b.has('development keys')), 'see docs/operations/NOVA-SIGNUP-001_Auth0_Development_Keys_Runbook.md');
  }
} finally {
  await b.close();
}
console.log(`RESULT ${failures === 0 ? 'PASS' : `FAIL (${failures} step(s))`} view=${view} app=${APP} site=${SITE}`);
process.exit(failures === 0 ? 0 : 1);
