'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import { createContext, useContext, useState, useEffect } from 'react'
import ConvexClientProvider from './ConvexClientProvider'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const ThemeContext = createContext({
  dark: false,
  setDark: () => {},
  theme: {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export const getTheme = (dark) => ({
  bg:          dark ? '#0f0f0f' : '#fafaf8',
  bgSecondary: dark ? '#161616' : '#f0ede8',
  text:        dark ? '#ede9e3' : '#1a1816',
  muted:       dark ? '#5a5550' : '#9b9189',
  card:        dark ? '#1a1a1a' : '#ffffff',
  border:      dark ? '#2a2a2a' : '#e8e4de',
  accent:      dark ? '#c9a96e' : '#b8935a',
  accentHover: dark ? '#d4b882' : '#a07840',
  badge:       dark ? '#222220' : '#f0ede8',
  navBg:       dark ? '#0a0a0a' : '#ffffff',
  serif:       "'Georgia', 'Times New Roman', serif",
  sans:        "'Inter', system-ui, sans-serif",
  mono:        "'JetBrains Mono', 'Fira Code', monospace",
})

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const theme = getTheme(dark)

  return (
    <ThemeContext.Provider value={{ dark, setDark, theme }}>
      <div style={{
        background: theme.bg,
        color: theme.text,
        minHeight: '100vh',
        transition: 'background 0.25s ease, color 0.25s ease',
        fontFamily: theme.sans,
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={geist.className} style={{ margin: 0, padding: 0 }}>
          <ConvexClientProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}