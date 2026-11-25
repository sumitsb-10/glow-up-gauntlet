const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(1000);
const meta = q('.doc-meta').textContent;
const foot = q('.doc-foot').textContent;
return {
  meta,
  foot,
  ok: /40 pages/.test(meta) && !/22 pages/.test(meta) && /page 12 of 40/.test(foot)
};
