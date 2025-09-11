import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Code, TrendingUp, Coins, Gamepad2, Briefcase } from 'lucide-react'
import Link from 'next/link'

const guilds = [
  {
    id: 'builder',
    name: 'Builder Guild',
    description:
      'Developers, founders, no-code tinkerers, designers, and tech writers who turn ideas into real solutions.',
    icon: Code,
    gradient: 'from-purple-500 via-blue-500 to-cyan-500',
    previewLink: '/guild-preview/builder',
  },
  {
    id: 'trader',
    name: 'Trader Guild',
    description:
      'Process-first traders and long-term holders focused on strategy, discipline, and top-tier opportunities.',
    icon: TrendingUp,
    gradient: 'from-pink-500 via-orange-500 to-yellow-500',
    previewLink: '/guild-preview/trader',
  },
  {
    id: 'gamer',
    name: 'Gamer Guild',
    description: 'Competitive P2E players & NFT collectors who analyze metas and curate winning collections.',
    icon: Gamepad2,
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    previewLink: '/guild-preview/gamer',
  },
  {
    id: 'farmer',
    name: 'Farmer Guild',
    description: 'DeFi & airdrop farmers who run bridges, staking, LPs, testnets—safely and consistently.',
    icon: Coins,
    gradient: 'from-cyan-500 via-teal-500 to-green-500',
    previewLink: '/guild-preview/farmer',
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder Guild',
    description: 'Web3 jobseekers & bounty hunters mapping routes to paid work—research, portfolios, clear pitches.',
    icon: Briefcase,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    previewLink: '/guild-preview/pathfinder',
  },
]

export default function GuildsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">Preview Mode</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Choose Your Guild</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Each guild offers specialized knowledge and community. Preview benefits now, full unlock after mint.
            You&apos;ll have 72 hours after minting to make your choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map((guild) => (
            <Card
              key={guild.id}
              className="bg-zinc-900/50 border-zinc-800 group relative overflow-hidden hover:scale-105 transition-all cursor-pointer"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${guild.gradient}`} />

              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                    <guild.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{guild.name}</h3>
                </div>

                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{guild.description}</p>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  asChild
                >
                  <Link href={guild.previewLink}>View Full Preview</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Join our Discord community and start earning your whitelist spot today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                asChild
              >
                <Link href="/how-to-wl">Claim WL</Link>
              </Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" asChild>
                <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
