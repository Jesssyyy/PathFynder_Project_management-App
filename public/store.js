// Shared storage: uses the Express API when available (local),
// falls back to localStorage + built-in generator on static hosts (Netlify).
(function (global) {
  function generateRoadmap(what, where) {
    return {
      steps: [
        { title: 'Clarify scope', detail: `Define what done looks like for: ${what}`, estimate: '1-2 days', dependsOn: null },
        { title: 'Check local requirements', detail: `Permits, rules and bookings in ${where}`, estimate: '2-3 days', dependsOn: 'Clarify scope' },
        { title: 'Plan resources', detail: 'List people, tools and budget needed', estimate: '1 day', dependsOn: 'Check local requirements' },
        { title: 'Do the work in small steps', detail: 'Execute step by step, track progress', estimate: '1-2 weeks', dependsOn: 'Plan resources' },
        { title: 'Review and adjust', detail: 'Handle delays and update the plan', estimate: 'Ongoing', dependsOn: 'Do the work in small steps' }
      ],
      risks: [
        { step: 'Check local requirements', text: `Permits or local rules in ${where} may add lead time.` },
        { step: 'Do the work in small steps', text: `Weather or seasonal conditions in ${where} could cause delays.` }
      ]
    };
  }

  async function apiAvailable() {
    try {
      const res = await fetch('/api/projects', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  const local = {
    read() {
      try {
        return JSON.parse(localStorage.getItem('pathfynder') || '{"projects":[],"notes":[]}');
      } catch {
        return { projects: [], notes: [] };
      }
    },
    write(db) {
      localStorage.setItem('pathfynder', JSON.stringify(db));
    }
  };

  let useApi = null;
  async function server() {
    if (useApi === null) useApi = await apiAvailable();
    return useApi;
  }

  global.Store = {
    async getProjects() {
      if (await server()) return (await fetch('/api/projects')).json();
      return local.read().projects;
    },
    async getProject(id) {
      if (await server()) return (await fetch(`/api/projects/${id}`)).json();
      return local.read().projects.find((p) => p.id === id);
    },
    async createProject(what, where) {
      if (await server()) {
        return (await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ what, where })
        })).json();
      }
      const db = local.read();
      const { steps, risks } = generateRoadmap(what, where);
      const project = { id: Date.now().toString(), what, where, createdAt: new Date().toISOString(), steps, risks, notes: '' };
      db.projects.unshift(project);
      local.write(db);
      return project;
    },
    async getNotes() {
      if (await server()) return (await fetch('/api/notes')).json();
      return local.read().notes;
    },
    async createNote(text) {
      if (await server()) {
        return (await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })).json();
      }
      const db = local.read();
      const note = { id: Date.now().toString(), text, createdAt: new Date().toISOString() };
      db.notes.unshift(note);
      local.write(db);
      return note;
    },
    async deleteNote(id) {
      if (await server()) {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        return;
      }
      const db = local.read();
      db.notes = db.notes.filter((n) => n.id !== id);
      local.write(db);
    },
    async convertNote(id, where) {
      if (await server()) {
        return (await fetch(`/api/notes/${id}/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ where })
        })).json();
      }
      const db = local.read();
      const note = db.notes.find((n) => n.id === id);
      const { steps, risks } = generateRoadmap(note.text, where);
      const project = { id: Date.now().toString(), what: note.text, where, createdAt: new Date().toISOString(), steps, risks, notes: '' };
      db.projects.unshift(project);
      local.write(db);
      return project;
    }
  };
})(window);
