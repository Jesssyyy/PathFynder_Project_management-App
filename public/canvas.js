const select = document.getElementById('project-select');
const board = document.getElementById('board');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function render(p) {
  const risksByStep = {};
  p.risks.forEach((r) => {
    (risksByStep[r.step] = risksByStep[r.step] || []).push(r.text);
  });
  board.innerHTML = `<h2>${esc(p.what)}</h2><p class="empty">${esc(p.where)}</p>
    <div class="board-track">` +
    p.steps.map((s, i) => `<article class="board-card">
        <div class="board-num">${i + 1}</div>
        <h3>${esc(s.title)}</h3>
        <span class="pill">${esc(s.estimate)}</span>
        <p>${esc(s.detail)}</p>
        ${(risksByStep[s.title] || []).map((t) => `<div class="risk">⚠ ${esc(t)}</div>`).join('')}
      </article>`).join('') + `</div>`;
}

async function init() {
  const projects = await Store.getProjects();
  if (!projects.length) {
    board.innerHTML = '<p class="empty">No projects yet — <a href="/build.html">build your first roadmap</a>.</p>';
    return;
  }
  select.innerHTML = projects.map((p) => `<option value="${esc(p.id)}">${esc(p.what)} — ${esc(p.where)}</option>`).join('');
  const params = new URLSearchParams(location.search);
  const initial = projects.find((p) => p.id === params.get('project')) || projects[0];
  select.value = initial.id;
  render(initial);
  select.addEventListener('change', async () => {
    render(await Store.getProject(select.value));
  });
}

init();
