// lib/theme.js  — shared across all pages
export const getTheme = (dark) => ({
  bg:         dark ? "#0a0a0a" : "#fafaf8",
  text:       dark ? "#f0ede8" : "#1a1816",
  muted:      dark ? "#6b6560" : "#9b9189",
  card:       dark ? "#141414" : "#ffffff",
  border:     dark ? "#252525" : "#e8e4de",
  accent:     dark ? "#c9a96e" : "#b8935a",
  accentHover:dark ? "#d4b882" : "#a07840",
  badge:      dark ? "#1e1c1a" : "#f0ede8",
  // fonts
  serif:      "'Georgia', 'Times New Roman', serif",
  sans:       "'Inter', system-ui, sans-serif",
})