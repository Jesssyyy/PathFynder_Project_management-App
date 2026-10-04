const noteForm = document.getElementById('note-form');
const noteText = document.getElementById('note-text');
const notesList = document.getElementById('notes');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function refresh() {
  const notes = await Store.getNotes();
  notesList.innerHTML = notes.length
    ? notes.map((n) => `<li class="note"><p>${esc(n.text)}</p>
        <div class="note-actions">
          <button data-convert="${esc(n.id)}">Turn into project →</button>
          <button data-delete="${esc(n.id)}" class="link">Delete</button>
        </div></li>`).join('')
    : '<li class="empty">No ideas yet — capture your first one above.</li>';
}

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = noteText.value.trim();
  if (!text) return;
  await Store.createNote(text);
  noteText.value = '';
  refresh();
});

notesList.addEventListener('click', async (e) => {
  const convertBtn = e.target.closest('button[data-convert]');
  const deleteBtn = e.target.closest('button[data-delete]');
  if (convertBtn) {
    const where = prompt('Where is this happening? (e.g. Leeds, UK)');
    if (!where) return;
    const project = await Store.convertNote(convertBtn.dataset.convert, where.trim());
    window.location.href = `/canvas.html?project=${project.id}`;
  } else if (deleteBtn) {
    await Store.deleteNote(deleteBtn.dataset.delete);
    refresh();
  }
});

refresh();
