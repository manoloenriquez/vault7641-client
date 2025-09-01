'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Coins, Gamepad2, Code, Briefcase, ArrowRight } from 'lucide-react'

const guilds = [
  {
    id: 'trader',
    name: 'Trader/HODLers',
    description: 'For those who live and breathe market movements',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    perks: ['Real-time market signals', 'Technical analysis workshops', 'Portfolio optimization tools'],
    weeklyActivity: 'Daily market briefings, swing trade setups, macro analysis sessions',
    rarity: 'Common',
  },
  {
    id: 'defi',
    name: 'DeFi & Airdrops',
    description: 'Masters of yield farming and airdrop hunting',
    icon: Coins,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    perks: ['Exclusive airdrop intel', 'Yield farming strategies', 'Protocol deep dives'],
    weeklyActivity: 'Airdrop farming guides, DeFi protocol reviews, yield optimization',
    rarity: 'Uncommon',
  },
  {
    id: 'nft-gaming',
    name: 'NFTs & Gaming',
    description: 'Digital collectors and Web3 gaming enthusiasts',
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    perks: ['NFT alpha and mint lists', 'Gaming guild partnerships', 'Metaverse land opportunities'],
    weeklyActivity: 'NFT project analysis, gaming tournaments, metaverse events',
    rarity: 'Rare',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Builders shaping the future of Web3',
    icon: Code,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    perks: ['Technical workshops', 'Code reviews & mentorship', 'Hackathon opportunities'],
    weeklyActivity: 'Code review sessions, tech talks, hackathon planning',
    rarity: 'Legendary',
  },
  {
    id: 'careers',
    name: 'Careers',
    description: 'Professionals building Web3 careers',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    perks: ['Job board access', 'Resume reviews', 'Networking events'],
    weeklyActivity: 'Career coaching, interview prep, industry networking',
    rarity: 'Uncommon',
  },
]

const rarityColors = {
  Common: 'bg-gray-500/20 text-gray-300',
  Uncommon: 'bg-green-500/20 text-green-400',
  Rare: 'bg-blue-500/20 text-blue-400',
  Legendary: 'bg-purple-500/20 text-purple-400',
}

export function GuildsSection() {
  return (
    <section id="guilds" className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Guild</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each guild offers specialized knowledge, tools, and community tailored to your Web3 journey. You&apos;ll
              have 72 hours after minting to make your choice.
            </p>
          </div>

          {/* Guilds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {guilds.map((guild) => (
              <div
                key={guild.id}
                className={`group relative bg-card/80 backdrop-blur-sm border ${guild.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                {/* Guild Icon & Rarity */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-16 h-16 ${guild.bgColor} rounded-xl flex items-center justify-center border ${guild.borderColor}`}
                  >
                    <guild.icon
                      className="w-8 h-8 text-current"
                      style={{ color: guild.color.split(' ')[1].replace('to-', '') }}
                    />
                  </div>
                  <Badge className={`${rarityColors[guild.rarity as keyof typeof rarityColors]} border-0`}>
                    {guild.rarity}
                  </Badge>
                </div>

                {/* Guild Info */}
                <h3 className="text-xl font-bold mb-2">{guild.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{guild.description}</p>

                {/* Perks */}
                <div className="space-y-2 mb-6">
                  {guild.perks.map((perk, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>

                {/* Sample Activity */}
                <div className="border-t border-border/50 pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Weekly Activities:</p>
                  <p className="text-xs text-muted-foreground/80">{guild.weeklyActivity}</p>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${guild.color.replace('from-', '').replace(' to-', ', ')})`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Guild Selection Info */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Guild Selection Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">72h</div>
                <p className="text-sm text-muted-foreground">Window to choose your guild after minting</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <p className="text-sm text-muted-foreground">Guild per Base Pass (choose wisely!)</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <p className="text-sm text-muted-foreground">Access to guild benefits and community</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                View Detailed Guild Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Join Discord to Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
