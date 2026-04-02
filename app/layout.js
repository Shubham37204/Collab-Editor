import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'CollabDocs',
  description: 'Real-time collaborative markdown editor',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geist.className} bg-gray-950 text-gray-100 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}