# PathFynder — Project Management App

> Turn a rough goal — "what I want to do" and "where I'm doing it" — into a realistic, step-by-step roadmap, with location-based risks flagged automatically, plus a free space to brainstorm and sketch ideas before they become a plan.

## Overview

Most people can picture the end goal of a project, but not the path to get there. They don't know how long things realistically take, what order tasks should happen in, or what risks are specific to where they're doing the work (permits, weather, local rules, market conditions).

Existing tools (Asana, Trello, Monday, Jira) assume you already have a plan — they help you track work, not build the plan in the first place. Common complaints:

- The tool becomes "a second job" — too much admin to keep updated.
- Too many views, fields, and options — no shared sense of what's going on.
- When something unexpected happens, it's unclear how the rest of the plan is affected.
- Small businesses outgrow the simple process that worked when they were small.
- People don't want to change how they work just to fit a team tool.

**PathFynder's opportunity:** be the tool that builds the plan for you, stays light to use, and treats "things changed" as a normal, handled event — not a crisis.

## Target Users

Individuals and small businesses who need to plan and run a project without a dedicated project manager:

- Freelancers and solo founders
- Small business owners
- Students (personal / academic projects)
- First-time founders / early-stage teams

Works equally well for:

1. One person doing everything themselves
2. One person planning and assigning to others
3. A small team collaborating as equals

No forced team structure upfront — start solo, add collaborators later.

## Goals & Success Metrics

| Goal | How we'll know it's working |
| ---- | --------------------------- |
| Turn a vague idea into a realistic plan | Blank input → usable roadmap in under 5 minutes |
| Reduce admin burden | Fewer required fields/steps than typical PM tools |
| Surface non-obvious risks | ≥1 risk flag per project the user hadn't considered |
| Keep people engaged, not overwhelmed | Low drop-off between first and second use |

## Product Principles

1. **Start light, grow later.** No forced setup, no mandatory team structure.
2. **Plan builds itself first, edited second.** AI does the first draft; user refines.
3. **Unexpected changes are normal.** Always ready to answer "what does this affect?"
4. **Ideas before structure.** Free-form brainstorm/sketch before rigid roadmap.
5. **Simple language, always.** No PM jargon — plain, human wording.

## Core User Journeys

### A — Idea to roadmap
1. User enters what they want to do + where.
2. PathFynder breaks it into ordered, tiny steps with realistic time estimates.
3. Location-based risks flagged (permits, weather, regulations, market).
4. User reviews, adjusts, and starts.

### B — Brainstorm to plan
1. User opens free-form brainstorm/sketch space — no structure required.
2. One click turns an idea into a structured project.
3. Roadmap generated as in Journey A.

### C — When something changes
1. User reports a delay, skip, or realized risk.
2. PathFynder shows what else is affected.
3. PathFynder suggests an updated plan for the user to approve (warn what's affected, let user decide — no silent rewrites).

## Features — MVP (Phase 1)

- **Simple input:** "What do you want to do?" + "Where is it happening?"
- **AI roadmap generation:** small ordered steps, time estimates, plain-language dependencies ("this can't start until that's done").
- **Location-based risk flagging:** legal/regulatory, weather/seasonal, economic/market, logistical — explained in plain language, shown alongside the relevant step.
- **Brainstorm & sketch space:** free-form notes/ideas, one-click convert to project.
- **Flexible collaboration:** fully usable solo; optional lightweight collaborators; assignable tasks.
- **Change handling:** report delay/skip/risk → see impact → approve suggested update.

## Phase 2 (Future, not in MVP)

- Location-based cost/resource estimation
- Progress tracking (ahead/behind indicators)
- Risk time-window notifications
- Shareable stakeholder view
- "Realism check" on unrealistic timelines
- Location comparison for the same project

## Out of Scope (For Now)

- Deep integrations (Jira, Asana import/export)
- Financial/accounting beyond basic estimates
- Enterprise permissions / admin controls
- Native mobile apps (web-first for MVP)

## Project Status

Initial commit — planning/spec phase. No app code yet.

## Getting Started

```bash
# clone
git clone https://github.com/Jesssyyy/PathFynder_Project_management-App.git
cd PathFynder_Project_management-App
```

App scaffolding coming next.

## Glossary

- **Roadmap:** step-by-step plan PathFynder builds.
- **Risk flag:** location-specific warning that could cause problems.
- **Brainstorm space:** free area for ideas with no required structure.
- **Collaborator:** someone added to share or assign tasks with.
