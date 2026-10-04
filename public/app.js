const form = document.getElementById('project-form');
const result = document.getElementById('result');
const resultCard = document.getElementById('result-card');
const list = document.getElementById('projects');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function refresh() {
  const projects = await Store.getProjects();
  list.innerHTML = projects.length
    ? projects.map((p) => `<li><button data-id="${esc(p.id)}">${esc(p.what)} — ${esc(p.where)}</button></li>`).join('')
    : '<li class="empty">No projects yet — build your first roadmap above.</li>';
}

function render(p) {
  result.innerHTML = `<h2>${esc(p.what)}</h2><p class="empty">${esc(p.where)}</p>` +
    p.steps.map((s, i) => `<div class="step"><strong>${i + 1}. ${esc(s.title)}</strong><em>${esc(s.estimate)}</em><p>${esc(s.detail)}</p>` +
      (s.dependsOn ? `<div class="dep">Starts after: ${esc(s.dependsOn)}</div>` : '') + `</div>`).join('') +
    `<h3>Location risks</h3>` + p.risks.map((r) => `<div class="risk"><strong>${esc(r.step)}:</strong> ${esc(r.text)}</div>`).join('');
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const what = document.getElementById('what').value.trim();
  const where = document.getElementById('where').value.trim();
  const project = await Store.createProject(what, where);
  render(project);
  refresh();
});

list.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  render(await Store.getProject(btn.dataset.id));
});

refresh();
