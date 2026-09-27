const form = document.getElementById('project-form');
const result = document.getElementById('result');
const list = document.getElementById('projects');

async function refresh() {
  const res = await fetch('/api/projects');
  const projects = await res.json();
  list.innerHTML = projects.map((p) => `<li><button data-id="${p.id}">${p.what} — ${p.where}</button></li>`).join('');
}

function render(p) {
  result.innerHTML = `<h2>${p.what} (${p.where})</h2>` +
    p.steps.map((s) => `<div class="step"><strong>${s.title}</strong> <em>${s.estimate}</em><p>${s.detail}</p></div>`).join('') +
    `<h3>Risks</h3>` + p.risks.map((r) => `<div class="risk"><strong>${r.step}:</strong> ${r.text}</div>`).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const what = document.getElementById('what').value.trim();
  const where = document.getElementById('where').value.trim();
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ what, where })
  });
  const project = await res.json();
  render(project);
  refresh();
});

list.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const res = await fetch(`/api/projects/${btn.dataset.id}`);
  render(await res.json());
});

refresh();
