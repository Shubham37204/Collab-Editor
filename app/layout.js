'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { dark as clerkDarkTheme } from '@clerk/themes'
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

export default function RootLayout({ children }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('collabdocs-theme')
    window.requestAnimationFrame(() => {
      if (saved === 'dark') setDark(true)
      setMounted(true)
    })
  }, [])


  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('collabdocs-theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark ? clerkDarkTheme : undefined,
        variables: {
          colorPrimary: '#f97316',
        },
        elements: {
          footer: { display: 'none' },
          footerAction: { display: 'none' }, 
          internal_branding: { display: 'none' },
        }
      }}
    >
      <ThemeContext.Provider value={{ dark, setDark }}>
        <html lang="en" suppressHydrationWarning className={dark ? 'dark' : ''}>
          <head>
            <title>CollabDocs — Real-time Collaborative Editor</title>
            <meta name="description" content="Write together, think together. Real-time collaborative markdown editing with live cursors, AI-powered writing assistance, and version history." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/logo.png" type="image/png" />
          </head>
          <body className={`${geist.className} bg-background text-foreground min-h-screen transition-colors duration-300 ease-in-out font-sans`} style={{ margin: 0, padding: 0 }}>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </body>
        </html>
      </ThemeContext.Provider>
    </ClerkProvider>
  )
}
