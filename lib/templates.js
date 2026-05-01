const today = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const TEMPLATES = [
  {
    id: "blank",
    label: "Blank Document",
    icon: "📄",
    description: "Start with a clean slate",
    content: "",
  },
  {
    id: "meeting",
    label: "Meeting Notes",
    icon: "📋",
    description: "Agenda, discussion & action items",
    content: `# Meeting Notes

## 📅 Details
- **Date:** ${today()}
- **Time:** 
- **Location / Link:** 
- **Attendees:** 

---

## 📌 Agenda
1. Review previous action items
2. 
3. 

## 💬 Discussion Notes
> Key takeaways and decisions go here.

- 

## ✅ Decisions
- **Decision 1:** 
- **Decision 2:** 

## 📋 Action Items
- [ ] @person — Task description — Due: 
- [ ] @person — Task description — Due: 
- [ ] @person — Task description — Due: 

## 📅 Next Meeting
- **Date:** 
- **Topics to revisit:** 
`,
  },
  {
    id: "brief",
    label: "Project Brief",
    icon: "🚀",
    description: "Goals, scope & timeline",
    content: `# Project Brief

## Overview
A brief summary of what this project is about and why it matters.

## 🎯 Objectives
1. 
2. 
3. 

## 📐 Scope
### In Scope
- 

### Out of Scope
- 

## 👥 Stakeholders
| Role | Name | Contact |
|------|------|---------|
| Project Lead | | |
| Designer | | |
| Engineer | | |

## 📅 Timeline
| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Kickoff | | 🟡 Planned |
| MVP | | 🟡 Planned |
| Launch | | 🟡 Planned |

## 🏆 Success Criteria
- [ ] Metric 1
- [ ] Metric 2
- [ ] Metric 3

## ⚠️ Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| | High | |
`,
  },
  {
    id: "journal",
    label: "Daily Journal",
    icon: "📓",
    description: "Reflect on your day",
    content: `# ${today()}

## 🌅 Morning Intention
> What do I want to accomplish today?

- 

## 🙏 Gratitude
1. 
2. 
3. 

## ✅ Accomplishments
- [ ] 
- [ ] 
- [ ] 

## 🧠 Learnings
- 

## 🌙 Evening Reflection
> How did the day go? What would I do differently?

- **Energy level:** /10
- **Mood:** 
- **One thing I'm proud of:** 

## 📅 Tomorrow's Focus
1. 
2. 
`,
  },
  {
    id: "techspec",
    label: "Tech Spec",
    icon: "⚙️",
    description: "Architecture & API design",
    content: `# Technical Specification

## 1. Overview
Brief description of the system or feature being specified.

### Problem Statement
What problem does this solve?

### Goals & Non-Goals
**Goals:**
- 

**Non-Goals:**
- 

## 2. Architecture

### System Diagram
> Add a diagram or describe the high-level architecture here.

### Components
| Component | Responsibility | Technology |
|-----------|---------------|------------|
| | | |

## 3. API Design

### Endpoints
\`\`\`
GET    /api/resource
POST   /api/resource
PUT    /api/resource/:id
DELETE /api/resource/:id
\`\`\`

### Request / Response Examples
\`\`\`json
{
  "id": "abc123",
  "name": "Example"
}
\`\`\`

## 4. Data Model
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| | | |

## 5. Testing Strategy
- [ ] Unit tests
- [ ] Integration tests
- [ ] Load testing

## 6. Rollout Plan
1. **Phase 1:** Internal testing
2. **Phase 2:** Beta rollout
3. **Phase 3:** General availability
`,
  },
  {
    id: "readme",
    label: "README",
    icon: "📘",
    description: "Project documentation",
    content: `# Project Name

> A brief, compelling description of what this project does.

## ✨ Features
- **Feature 1** — Description
- **Feature 2** — Description
- **Feature 3** — Description

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation
\`\`\`bash
git clone https://github.com/username/project.git
cd project
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
\`\`\`
├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
├── public/
├── package.json
└── README.md
\`\`\`

## 🛠 Tech Stack
| Technology | Purpose |
|-----------|---------|
| | |

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing\`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License.
`,
  },
];
