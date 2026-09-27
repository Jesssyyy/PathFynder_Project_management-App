const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Local rule-based roadmap generator (offline placeholder for future AI).
function generateRoadmap(what, where) {
  const steps = [
    { title: 'Clarify scope', detail: `Define what done looks like for: ${what}`, estimate: '1-2 days', dependsOn: null },
    { title: 'Check local requirements', detail: `Permits, rules and bookings in ${where}`, estimate: '2-3 days', dependsOn: 'Clarify scope' },
    { title: 'Plan resources', detail: 'List people, tools and budget needed', estimate: '1 day', dependsOn: 'Check local requirements' },
    { title: 'Do the work in small steps', detail: 'Execute step by step, track progress', estimate: '1-2 weeks', dependsOn: 'Plan resources' },
    { title: 'Review and adjust', detail: 'Handle delays and update the plan', estimate: 'Ongoing', dependsOn: 'Do the work in small steps' }
  ];
  const risks = [
    { step: 'Check local requirements', text: `Permits or local rules in ${where} may add lead time.` },
    { step: 'Do the work in small steps', text: `Weather or seasonal conditions in ${where} could cause delays.` }
  ];
  return { steps, risks };
}

app.get('/api/projects', (req, res) => {
  res.json(loadDb().projects);
});

app.post('/api/projects', (req, res) => {
  const { what, where } = req.body || {};
  if (!what || !where) return res.status(400).json({ error: '"what" and "where" are required' });
  const db = loadDb();
  const { steps, risks } = generateRoadmap(what, where);
  const project = {
    id: Date.now().toString(),
    what,
    where,
    createdAt: new Date().toISOString(),
    steps,
    risks,
    notes: ''
  };
  db.projects.unshift(project);
  saveDb(db);
  res.status(201).json(project);
});

app.get('/api/projects/:id', (req, res) => {
  const project = loadDb().projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
});

app.listen(PORT, () => {
  console.log(`PathFynder prototype running at http://localhost:${PORT}`);
});
