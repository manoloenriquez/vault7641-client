import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { VaultNavigation } from '@/components/vault/vault-navigation'
// import { DiscordJoinBanner } from '@/components/vault/discord-join-banner'
import React from 'react'
import { AppFooterV2 } from '@/components/app-footer-v2'

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  // Suppress unused variable warning
  void links

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(255,56,161,0.12),transparent),radial-gradient(800px_400px_at_20%_-10%,rgba(34,211,238,0.10),transparent)] bg-zinc-950 text-zinc-200">
        <VaultNavigation />
        <main className="pt-32">{children}</main>
        <AppFooterV2 />
        {/* <DiscordJoinBanner /> */}
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
