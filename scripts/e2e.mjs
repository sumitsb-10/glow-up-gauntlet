/**
 * Minimal CDP driver for the game.
 * Usage:
 *   node scripts/e2e.mjs "<file url>" "<async expression>" [--shot out.png] [--w 1280] [--h 800]
 * Prints the expression's JSON result. Exit code 1 on JS error.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const url = args[0];
const getFlag = (n, d) => {
  const i = args.indexOf('--' + n);
  return i === -1 ? d : args[i + 1];
};
const scriptFile = getFlag('script', null);
const expr = scriptFile ? readFileSync(scriptFile, 'utf8') : args[1];

const shot = getFlag('shot', null);
const shotAfter = getFlag('shot-after', null);
const W = Number(getFlag('w', 1280));
const H = Number(getFlag('h', 800));
const PORT = 9300 + Math.floor(Math.random() * 400);

const EDGE = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].find((p) => existsSync(p));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const extraArgs = [];
if (args.includes('--reduce')) extraArgs.push('--force-prefers-reduced-motion');

const proc = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--hide-scrollbars',
  '--disable-extensions',
  ...extraArgs,
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TEMP}\\gg-e2e-${PORT}`,
  `--window-size=${W},${H}`,
  'about:blank'
], { stdio: 'ignore' });

async function waitFor(fn, ms = 15000, step = 120) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { const v = await fn(); if (v) return v; } catch {}
    await sleep(step);
  }
  throw new Error('timeout');
}

function rpc(ws, id, method, params) {
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) {
        ws.removeEventListener('message', onMsg);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });
}

let ws;
try {
  await waitFor(async () => (await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok);
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const send = (method, params) => rpc(ws, ++id, method, params);
  await send('Runtime.enable');
  await send('Page.enable');

  await waitFor(async () => {
    const r = await send('Runtime.evaluate', {
      expression: "document.readyState === 'complete' && document.documentElement.dataset.ready === '1'",
      returnByValue: true
    });
    return r.result.value === true;
  });

  if (shot) {
    await sleep(700);
    const cap = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(dirname(shot), { recursive: true });
    writeFileSync(shot, Buffer.from(cap.data, 'base64'));
  }

  const wrapped = `(async () => { ${expr} })()`;
  const r = await send('Runtime.evaluate', {
    expression: wrapped,
    awaitPromise: true,
    returnByValue: true
  });

  if (r.exceptionDetails) {
    console.error('JS ERROR:', JSON.stringify(r.exceptionDetails, null, 2));
    process.exitCode = 1;
  } else {
    const value = r.result.value;
    console.log(JSON.stringify(value, null, 2));
    if (value && typeof value === 'object' && value.ok === false) {
      console.error('TEST FAILED: script returned { ok: false }');
      process.exitCode = 1;
    }
  }

  if (shotAfter) {
    await sleep(400);
    const cap2 = await send('Page.captureScreenshot', { format: 'png' });
    mkdirSync(dirname(shotAfter), { recursive: true });
    writeFileSync(shotAfter, Buffer.from(cap2.data, 'base64'));
    console.log('SHOT ' + shotAfter);
  }
} catch (e) {
  console.error('DRIVER ERROR:', e.message);
  process.exitCode = 1;
} finally {
  try { ws && ws.close(); } catch {}
  proc.kill();
}
