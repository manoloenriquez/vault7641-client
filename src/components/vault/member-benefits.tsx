'use client'

import { Badge } from '@/components/ui/badge'
import { Lock, Trophy, Calendar, Gift, Zap, Users } from 'lucide-react'

const benefits = [
  {
    icon: Lock,
    title: 'Immediate Vault Access',
    description: 'Unlock exclusive content, tools, and resources within 48 hours of verification.',
    highlight: 'Available in 48h',
  },
  {
    icon: Calendar,
    title: 'Weekly Calendar',
    description: 'Curated events, workshops, and opportunities tailored to your guild.',
    highlight: 'Guild-specific',
  },
  {
    icon: Trophy,
    title: 'Quests & XP System',
    description: 'Earn experience points through challenges and climb the community leaderboard.',
    highlight: 'Gamified',
  },
  {
    icon: Gift,
    title: 'Partner Perks',
    description: 'Exclusive discounts, early access, and special offers from Web3 partners.',
    highlight: 'Exclusive',
  },
  {
    icon: Zap,
    title: 'Raffles & Giveaways',
    description: 'Regular community raffles with valuable prizes and opportunities.',
    highlight: 'Weekly',
  },
  {
    icon: Users,
    title: 'Inter-Guild Cup',
    description: 'Compete in seasonal competitions between guilds for ultimate bragging rights.',
    highlight: 'Competitive',
  },
]

export function MemberBenefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Member Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Your Base Pass unlocks a world of opportunities, education, and exclusive perks designed to accelerate
              your Web3 journey.
            </p>

            {/* Disclaimer */}
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> This is a digital membership collectible that grants access to community
                content and perks. It is not an investment, security, or deposit product.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {benefit.highlight}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Real Value, No Hype</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in providing genuine utility and education. Our focus is on building skills, creating
                opportunities, and fostering meaningful connections in the Web3 space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">5</div>
                <div className="text-sm text-muted-foreground">Specialized Guilds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Community Access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">∞</div>
                <div className="text-sm text-muted-foreground">Learning Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-muted-foreground">Empty Promises</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
