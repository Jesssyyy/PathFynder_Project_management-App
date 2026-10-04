require('dotenv').config();
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
  const db = JSON.parse(raw);
  if (!Array.isArray(db.projects)) db.projects = [];
  if (!Array.isArray(db.notes)) db.notes = [];
  return db;
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Offline template used when no API key is set or the AI call fails.
function templateRoadmap(what, where) {
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

// AI roadmap generation via Groq (OpenAI-compatible API).
// Falls back to the offline template on any failure.
async function generateRoadmap(what, where) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return templateRoadmap(what, where);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You plan real-world projects. Reply with JSON only: {"steps":[{"title":"","detail":"","estimate":"","dependsOn":"" or null}],"risks":[{"step":"","text":""}]}. Steps: 5-8 small ordered tasks with realistic estimates and plain-language dependencies. Risks: 2-4 location-specific flags (legal, weather, market, logistical), each tied to a step title.'
          },
          { role: 'user', content: `Goal: ${what}\nLocation: ${where}` }
        ]
      })
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    if (!Array.isArray(parsed.steps) || !Array.isArray(parsed.risks)) throw new Error('Bad shape');
    return { steps: parsed.steps, risks: parsed.risks };
  } catch (err) {
    console.error('AI generation failed, using template:', err.message);
    return templateRoadmap(what, where);
  }
}

app.get('/api/projects', (req, res) => {
  res.json(loadDb().projects);
});

app.post('/api/projects', async (req, res) => {
  const { what, where } = req.body || {};
  if (!what || !where) return res.status(400).json({ error: '"what" and "where" are required' });
  const db = loadDb();
  const { steps, risks } = await generateRoadmap(what, where);
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

// Brainstorm notes (Journey B): free-form ideas, one-click convert to project.
app.get('/api/notes', (req, res) => {
  res.json(loadDb().notes);
});

app.post('/api/notes', (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: '"text" is required' });
  const db = loadDb();
  const note = { id: Date.now().toString(), text: text.trim(), createdAt: new Date().toISOString() };
  db.notes.unshift(note);
  saveDb(db);
  res.status(201).json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const db = loadDb();
  db.notes = db.notes.filter((n) => n.id !== req.params.id);
  saveDb(db);
  res.status(204).end();
});

app.post('/api/notes/:id/convert', async (req, res) => {
  const { where } = req.body || {};
  if (!where) return res.status(400).json({ error: '"where" is required' });
  const db = loadDb();
  const note = db.notes.find((n) => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  const { steps, risks } = await generateRoadmap(note.text, where);
  const project = {
    id: Date.now().toString(),
    what: note.text,
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

app.listen(PORT, () => {
  console.log(`PathFynder prototype running at http://localhost:${PORT}`);
});
