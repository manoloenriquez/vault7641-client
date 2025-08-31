'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Clock } from 'lucide-react'

const roadmapItems = [
  {
    quarter: 'Q4 2024',
    status: 'completed',
    items: [
      { title: 'Base Pass Mint Launch', completed: true },
      { title: 'Guild System Implementation', completed: true },
      { title: 'Discord Integration', completed: true },
      { title: 'Initial Community Building', completed: true },
    ],
  },
  {
    quarter: 'Q1 2025',
    status: 'in-progress',
    items: [
      { title: 'XP & Leaderboard System', completed: true },
      { title: 'Partner Integration Program', completed: false },
      { title: 'Mobile App Beta', completed: false },
      { title: 'Advanced Trading Tools', completed: false },
    ],
  },
  {
    quarter: 'Q2 2025',
    status: 'planned',
    items: [
      { title: 'Season 2 Pass Launch', completed: false },
      { title: 'Cross-Chain Expansion', completed: false },
      { title: 'AI-Powered Recommendations', completed: false },
      { title: 'Guild vs Guild Tournaments', completed: false },
    ],
  },
  {
    quarter: 'Q3 2025',
    status: 'planned',
    items: [
      { title: 'Metaverse Guild Halls', completed: false },
      { title: 'NFT Marketplace Integration', completed: false },
      { title: 'Advanced Analytics Dashboard', completed: false },
      { title: 'Community Governance Launch', completed: false },
    ],
  },
]

const shippedFeatures = [
  'Discord verification system',
  'Guild selection interface',
  'Base Pass minting portal',
  'Community onboarding flow',
  'Mobile-responsive design',
  'Wallet integration',
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'planned':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle
    case 'in-progress':
      return Clock
    case 'planned':
      return Circle
    default:
      return Circle
  }
}

export function RoadmapSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Roadmap & Seasons</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our journey is structured in seasons, each bringing new features, opportunities, and ways to grow together
              as a community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Roadmap Timeline */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-8">Development Timeline</h3>
              <div className="space-y-8">
                {roadmapItems.map((quarter, index) => {
                  const StatusIcon = getStatusIcon(quarter.status)
                  return (
                    <div key={quarter.quarter} className="relative">
                      {/* Connection line */}
                      {index < roadmapItems.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
                      )}

                      <div className="flex items-start gap-4">
                        {/* Quarter Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${getStatusColor(quarter.status)}`}
                        >
                          <StatusIcon className="w-6 h-6" />
                        </div>

                        {/* Quarter Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="text-xl font-bold">{quarter.quarter}</h4>
                            <Badge className={`${getStatusColor(quarter.status)} border`}>
                              {quarter.status.replace('-', ' ')}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {quarter.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center gap-2 text-sm">
                                {item.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                                  {item.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shipped Features & Season Info */}
            <div className="space-y-8">
              {/* Season Model */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Season Model</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">6 months</div>
                    <div className="text-sm text-muted-foreground">Season duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">Evolving</div>
                    <div className="text-sm text-muted-foreground">Membership benefits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">Optional</div>
                    <div className="text-sm text-muted-foreground">Season renewal</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Each season brings new features, challenges, and opportunities while maintaining your core guild
                  membership benefits.
                </p>
              </div>

              {/* Recently Shipped */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Recently Shipped</h3>
                <div className="space-y-2">
                  {shippedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    We ship features based on community feedback and needs. Join Discord to influence our roadmap!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
