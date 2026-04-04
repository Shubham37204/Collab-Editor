export const TEMPLATES = [
  {
    id: "blank",
    label: "📄 Blank",
    description: "Start from scratch",
    content: "",
  },
  {
    id: "meeting",
    label: "📋 Meeting Notes",
    description: "Agenda, discussion, action items",
    content: `# Meeting Notes`,
  },
  {
    id: "brief",
    label: "🚀 Project Brief",
    description: "Goals, scope, timeline",
    content: `# Project Brief`,
  },
  {
    id: "journal",
    label: "📓 Daily Journal",
    description: "Reflect on your day",
    content: `# ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`,
  },
  {
    id: "techspec",
    label: "⚙️ Tech Spec",
    description: "Architecture and API design",
    content: `# Technical Specification`,
  },
  {
    id: "readme",
    label: "📘 README",
    description: "Project documentation",
    content: `# Project Name`,
  },
];
