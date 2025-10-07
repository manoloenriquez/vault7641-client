import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Vault 7641 - Your Crypto Homebase',
  description:
    'A curated Web3 community with unlimited education, opportunities, and fun perks. Join 5 specialized guilds and unlock your potential.',
  keywords: ['Web3', 'Solana', 'NFT', 'Community', 'Education', 'DeFi', 'Trading', 'Gaming'],
  openGraph: {
    title: 'Vault 7641 - Your Crypto Homebase',
    description: 'A curated Web3 community with unlimited education, opportunities, and fun perks.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vault 7641 - Your Crypto Homebase',
    description: 'A curated Web3 community with unlimited education, opportunities, and fun perks.',
  },
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Home', path: '/' },
  { label: 'Account', path: '/account' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>

      <Analytics />
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
