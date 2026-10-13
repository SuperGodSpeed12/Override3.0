import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'GL1TCH: OVERRIDE',
  description: 'You are an Illegal Instruction. The system is purging itself. Reach the Root Directory before it is too late.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#00FFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased scanlines`}>
        {children}
      </body>
    </html>
  )
}
