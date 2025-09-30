import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ClientProvider } from '@/components/providers/client-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Donation System',
  description: 'Donation System',
  generator: 'Donation System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientProvider>
          {children}
          <Analytics />
        </ClientProvider>
      </body>
    </html>
  )
}
