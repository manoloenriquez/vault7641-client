'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, ExternalLink, PlayCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface GuildPreviewProps {
  guildData: {
    id: string
    name: string
    description: string
    whoItIsFor: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    borderColor: string
    weeklyActivities: string[]
    foundingQuests: {
      title: string
      description: string
      reward: string
      difficulty: string
      timeEstimate: string
    }[]
    nextClass: {
      title: string
      date: string
      time: string
      instructor: string
      description: string
    }
    holderBenefits: string[]
  }
}

export function GuildPreviewTemplate({ guildData }: GuildPreviewProps) {
  const IconComponent = guildData.icon

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className={`w-20 h-20 ${guildData.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 border ${guildData.borderColor}`}
            >
              <IconComponent className="w-10 h-10" />
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">Preview Mode</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Is the {guildData.name} Guild for you?</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{guildData.whoItIsFor}</p>
          </div>

          {/* Weekly Activities */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Weekly Activities</h2>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guildData.weeklyActivities.map((activity, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Founding Quests */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Try it now: Founding Quests</h2>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Free to Try</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guildData.foundingQuests.map((quest, index) => (
                <div
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold pr-4">{quest.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {quest.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{quest.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reward: </span>
                      <span className="font-semibold text-primary">{quest.reward}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quest.timeEstimate}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Start Quest
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Open Class */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Open Class (Watch-Only)</h2>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <PlayCircle className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{guildData.nextClass.title}</h3>
                      <p className="text-sm text-muted-foreground">with {guildData.nextClass.instructor}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{guildData.nextClass.description}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        {new Date(guildData.nextClass.date).toLocaleDateString()} at {guildData.nextClass.time} PH
                      </span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Free Access</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    RSVP for Class
                  </Button>
                  <Button variant="outline" size="lg">
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Holders Unlock */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Holders Unlock</h2>
            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guildData.holderBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-6">Ready to unlock the full {guildData.name} experience?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Claim WL
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                      Join Discord
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our Discord community, preview the {guildData.name} guild, and see tonight&apos;s events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  asChild
                >
                  <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                    Join Discord
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-to-wl">Claim WL</Link>
                </Button>
                <Button variant="ghost" size="lg">
                  See Tonight&apos;s Event
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
