'use client'

import { Badge } from '@/components/ui/badge'
import { Quote } from 'lucide-react'

const partners = [
  { name: 'Solana Foundation', logo: '/logos/solana.svg' },
  { name: 'Magic Eden', logo: '/logos/magic-eden.svg' },
  { name: 'Jupiter', logo: '/logos/jupiter.svg' },
  { name: 'Phantom', logo: '/logos/phantom.svg' },
  { name: 'Dialect', logo: '/logos/dialect.svg' },
  { name: 'Helius', logo: '/logos/helius.svg' },
]

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'DeFi Trader',
    guild: 'DeFi & Airdrops',
    content: 'Vault 7641 helped me discover protocols that 10x my portfolio. The alpha here is unmatched.',
    avatar: '/avatars/alex.jpg',
  },
  {
    name: 'Sarah Kim',
    role: 'NFT Collector',
    guild: 'NFTs & Gaming',
    content: 'The mint alerts and rarity analysis tools have saved me thousands. Best investment I&apos;ve made.',
    avatar: '/avatars/sarah.jpg',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Solana Developer',
    guild: 'Developer',
    content: 'The technical workshops and code reviews accelerated my Web3 development skills significantly.',
    avatar: '/avatars/marcus.jpg',
  },
]

const stats = [
  { value: '5,000+', label: 'Active Members' },
  { value: '50+', label: 'Partner Projects' },
  { value: '$2M+', label: 'Member Profits Tracked' },
  { value: '95%', label: 'Member Satisfaction' },
]

const mediaFeatures = [
  'Featured in CoinDesk',
  'Solana Newsletter Spotlight',
  'Web3 Community of the Year Nominee',
  'Top 10 Discord Servers by Engagement',
]

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join a community that&apos;s already helping members achieve their Web3 goals with real results and
              genuine connections.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-12">What Members Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {testimonial.guild}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Ecosystem Partners</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
              {partners.map((partner, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">{partner.name.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{partner.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Features */}
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-6">As Seen In</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaFeatures.map((feature, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
