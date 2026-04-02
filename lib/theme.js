// // lib/theme.js  — shared across all pages
// export const getTheme = (dark) => ({
//   bg:         dark ? "#0a0a0a" : "#fafaf8",
//   text:       dark ? "#f0ede8" : "#1a1816",
//   muted:      dark ? "#6b6560" : "#9b9189",
//   card:       dark ? "#141414" : "#ffffff",
//   border:     dark ? "#252525" : "#e8e4de",
//   accent:     dark ? "#c9a96e" : "#b8935a",
//   accentHover:dark ? "#d4b882" : "#a07840",
//   badge:      dark ? "#1e1c1a" : "#f0ede8",
//   // fonts
//   serif:      "'Georgia', 'Times New Roman', serif",
//   sans:       "'Inter', system-ui, sans-serif",
// })

// ═══════════════════════════════════════════════════
// FEATURE: Document Templates
// Used in dashboard create modal — pre-fills content
// ═══════════════════════════════════════════════════

export const TEMPLATES = [
  {
    id: 'blank',
    label: '📄 Blank',
    description: 'Start from scratch',
    content: '',
  },
  {
    id: 'meeting',
    label: '📋 Meeting Notes',
    description: 'Agenda, discussion, action items',
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Attendees:** 

---

## Agenda
1. 
2. 
3. 

## Discussion

## Decisions Made

## Action Items
- [ ] 
- [ ] 

## Next Meeting
`,
  },
  {
    id: 'brief',
    label: '🚀 Project Brief',
    description: 'Goals, scope, timeline',
    content: `# Project Brief

## Overview
What is this project and why does it matter?

## Goals
- 
- 

## Scope
### In scope
- 

### Out of scope
- 

## Timeline
| Milestone | Date |
|-----------|------|
| Kickoff   |      |
| MVP       |      |
| Launch    |      |

## Stakeholders
| Name | Role |
|------|------|
|      |      |

## Open Questions
- 
`,
  },
  {
    id: 'journal',
    label: '📓 Daily Journal',
    description: 'Reflect on your day',
    content: `# ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

## Intentions for today
- 

## What I worked on

## What went well

## What I'd do differently

## Grateful for
1. 
2. 
3. 

## Tomorrow
- 
`,
  },
  {
    id: 'techspec',
    label: '⚙️ Tech Spec',
    description: 'Architecture and API design',
    content: `# Technical Specification

## Problem Statement

## Proposed Solution

## Architecture
\`\`\`
[diagram here]
\`\`\`

## Data Models
\`\`\`js
{
  
}
\`\`\`

## API Design
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    |          |             |
| POST   |          |             |

## Edge Cases
- 

## Performance Considerations

## Open Questions
- 
`,
  },
  {
    id: 'readme',
    label: '📘 README',
    description: 'Project documentation',
    content: `# Project Name

> One-line description of what this does.

## Features
- ✅ 
- ✅ 

## Tech Stack
- 
- 

## Getting Started

\`\`\`bash
git clone https://github.com/username/repo
cd repo
npm install
npm run dev
\`\`\`

## Environment Variables
\`\`\`
VARIABLE_NAME=value
\`\`\`

## Project Structure
\`\`\`
/
├── app/
├── components/
└── lib/
\`\`\`

## Contributing
Pull requests welcome.

## License
MIT
`,
  },
]