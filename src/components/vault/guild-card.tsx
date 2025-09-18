'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { GuildBenefitsPopover } from './guild-benefits-popover'

interface GuildCardProps {
  id: string
  name: string
  description: string
  gradient: string
  activities: string[]
  benefits: string[]
}

export function GuildCard({ id, name, description, gradient, activities, benefits }: GuildCardProps) {
  return (
    <Card className="bg-zinc-950/50 border-zinc-800 group relative overflow-hidden hover:scale-105 transition-all">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
            <Image
              src={`/${id.charAt(0).toUpperCase() + id.slice(1)}_logo.jpg`}
              alt={`${name} Logo`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
        </div>

        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{description}</p>

        <div className="space-y-2 mb-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-1 h-1 bg-white rounded-full mr-3 flex-shrink-0" />
              <span className="text-zinc-300">{activity}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <GuildBenefitsPopover benefits={benefits} />
          <a
            href="https://discord.gg/vault7641"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-left text-sm text-cyan-400 hover:text-cyan-300"
          >
            Join Discord →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
