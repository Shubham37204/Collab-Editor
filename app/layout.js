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
})

export function useTheme() {
  return useContext(ThemeContext)
}

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('collabdocs-theme')
    if (saved === 'dark') setDark(true)
    setMounted(true)
  }, [])

  // Sync dark class + persist
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('collabdocs-theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300 ease-in-out font-sans">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>CollabDocs — Real-time Collaborative Editor</title>
          <meta name="description" content="Write together, think together. Real-time collaborative markdown editing with live cursors, AI-powered writing assistance, and version history." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
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