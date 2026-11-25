const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));
window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

const out = { ch1Mounts: [], attractMounts: [] };
await wait(400);

for (let i = 0; i < 10; i++) {
  window.GG.nav('ch1');
  await wait(420);
  out.ch1Mounts.push({
    sections: document.querySelectorAll('#scene > section').length,
    laptops: document.querySelectorAll('.lp').length,
    files: document.querySelectorAll('.file').length,
    scene: document.documentElement.dataset.scene
  });

  // leave mid-lag with timers in flight
  const f = q('.file');
  if (f) f.click();
  await wait(90);

  window.GG.nav('attract');
  await wait(420);
  out.attractMounts.push({
    sections: document.querySelectorAll('#scene > section').length,
    laptops: document.querySelectorAll('.lp').length,
    files: document.querySelectorAll('.file').length,
    scene: document.documentElement.dataset.scene
  });
}

out.errors = errors;
out.final = document.documentElement.dataset.scene;
return out;
