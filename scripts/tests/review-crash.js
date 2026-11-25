const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const q = (s) => document.querySelector(s);

await wait(1400);
const crash = q('.crash');
const rescue = q('.rescue');
const out = {
  role: crash && crash.getAttribute('role'),
  modal: crash && crash.getAttribute('aria-modal'),
  rescueShown: !!rescue && rescue.classList.contains('show'),
  rescueFocused: document.activeElement === rescue
};
out.ok = out.role === 'alertdialog' && out.modal === 'true' && out.rescueShown && out.rescueFocused;
return out;
