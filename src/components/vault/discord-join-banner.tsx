'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function DiscordJoinBanner() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-md">
        <div className="w-6 h-6 bg-zinc-700/80 rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-white" />
        </div>
        <div className="text-white text-xs sm:text-sm font-medium text-nowrap">Get Whitelisted Now!</div>
        <Button
          size="sm"
          className="bg-white text-zinc-900 hover:bg-zinc-100 font-semibold rounded-xl px-3 py-1.5 text-xs"
          asChild
        >
          <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
            Join Discord
          </a>
        </Button>
      </div>
    </div>
  )
}
