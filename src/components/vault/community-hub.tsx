'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trophy, Target, Users, MapPin, Award, Zap } from 'lucide-react'

const upcomingEvents = [
  {
    id: 1,
    title: 'DeFi Deep Dive: Yield Farming Strategies',
    date: '2024-12-28',
    time: '15:00 UTC',
    type: 'Workshop',
    guild: 'DeFi & Airdrops',
    attendees: 127,
    maxAttendees: 150,
    location: 'Discord Stage',
    host: 'Sarah Kim',
    description: 'Learn advanced yield farming techniques and risk management strategies for maximizing DeFi returns.',
    featured: true,
  },
  {
    id: 2,
    title: 'NFT Project Analysis Session',
    date: '2024-12-29',
    time: '18:00 UTC',
    type: 'Analysis',
    guild: 'NFTs & Gaming',
    attendees: 89,
    maxAttendees: 100,
    location: 'Discord Voice',
    host: 'Marcus Rodriguez',
    description: 'Live analysis of upcoming NFT drops with community Q&A and evaluation framework.',
    featured: false,
  },
  {
    id: 3,
    title: 'Solana Development Office Hours',
    date: '2024-12-30',
    time: '20:00 UTC',
    type: 'Office Hours',
    guild: 'Developer',
    attendees: 45,
    maxAttendees: 50,
    location: 'Discord Voice',
    host: 'David Park',
    description: 'Get help with your Solana projects, code reviews, and technical questions.',
    featured: false,
  },
  {
    id: 4,
    title: 'New Year Trading Outlook 2025',
    date: '2025-01-02',
    time: '16:00 UTC',
    type: 'Webinar',
    guild: 'Trader/HODLers',
    attendees: 203,
    maxAttendees: 250,
    location: 'Discord Stage',
    host: 'Alex Chen',
    description: 'Market analysis and trading strategies for the upcoming year with special guest analysts.',
    featured: true,
  },
]

const activeQuests = [
  {
    id: 1,
    title: 'DeFi Explorer',
    description: 'Complete 5 DeFi transactions on different protocols',
    reward: '500 XP + DeFi Badge',
    difficulty: 'Intermediate',
    progress: 60,
    timeLeft: '5 days',
    participants: 234,
    guild: 'DeFi & Airdrops',
  },
  {
    id: 2,
    title: 'Community Builder',
    description: 'Refer 3 new members to Vault 7641',
    reward: '750 XP + Referral Badge',
    difficulty: 'Easy',
    progress: 33,
    timeLeft: '12 days',
    participants: 156,
    guild: 'All Guilds',
  },
  {
    id: 3,
    title: 'Code Contributor',
    description: 'Submit a pull request to community tools repo',
    reward: '1000 XP + Developer Badge',
    difficulty: 'Advanced',
    progress: 0,
    timeLeft: '20 days',
    participants: 67,
    guild: 'Developer',
  },
]

const leaderboard = [
  { rank: 1, username: 'CryptoNinja', guild: 'DeFi & Airdrops', xp: 12450, badges: 8, change: 'up' },
  { rank: 2, username: 'SolanaBuilder', guild: 'Developer', xp: 11230, badges: 12, change: 'up' },
  { rank: 3, username: 'NFTCollector', guild: 'NFTs & Gaming', xp: 10890, badges: 6, change: 'down' },
  { rank: 4, username: 'YieldFarmer', guild: 'DeFi & Airdrops', xp: 9670, badges: 9, change: 'up' },
  { rank: 5, username: 'TradeGuru', guild: 'Trader/HODLers', xp: 9340, badges: 7, change: 'same' },
  { rank: 6, username: 'WebThreePro', guild: 'Careers', xp: 8920, badges: 5, change: 'up' },
  { rank: 7, username: 'DeFiMaster', guild: 'DeFi & Airdrops', xp: 8550, badges: 11, change: 'down' },
  { rank: 8, username: 'CodeWarrior', guild: 'Developer', xp: 8120, badges: 10, change: 'up' },
]

const guildColors = {
  'Trader/HODLers': 'bg-green-500/20 text-green-400',
  'DeFi & Airdrops': 'bg-blue-500/20 text-blue-400',
  'NFTs & Gaming': 'bg-purple-500/20 text-purple-400',
  Developer: 'bg-orange-500/20 text-orange-400',
  Careers: 'bg-indigo-500/20 text-indigo-400',
  'All Guilds': 'bg-muted text-muted-foreground',
}

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-400',
  Intermediate: 'bg-yellow-500/20 text-yellow-400',
  Advanced: 'bg-red-500/20 text-red-400',
}

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState<'events' | 'quests' | 'leaderboard'>('events')

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Community Hub</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect, learn, and grow with fellow Web3 enthusiasts. Participate in events, complete quests, and climb
              the leaderboard to earn rewards and recognition.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">5,247</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">127</div>
              <div className="text-sm text-muted-foreground">Events This Month</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">43</div>
              <div className="text-sm text-muted-foreground">Active Quests</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">2.4M</div>
              <div className="text-sm text-muted-foreground">XP Distributed</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-2">
              <div className="flex gap-2">
                {[
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'quests', label: 'Quests', icon: Target },
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'events' | 'quests' | 'leaderboard')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Tab */}
          {activeTab === 'events' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
                <Button variant="outline">View Calendar</Button>
              </div>

              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 ${event.featured ? 'ring-2 ring-primary/20' : ''}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          {event.featured && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">Featured</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-4">{event.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees}/{event.maxAttendees} attending
                          </div>
                          <Badge className={guildColors[event.guild as keyof typeof guildColors] || 'bg-muted'}>
                            {event.guild}
                          </Badge>
                        </div>

                        <div className="mt-4 text-sm">
                          <span className="text-muted-foreground">Hosted by </span>
                          <span className="font-semibold">{event.host}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          Join Event
                        </Button>
                        <Button variant="outline" size="sm">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quests Tab */}
          {activeTab === 'quests' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Active Quests</h2>
                <Button variant="outline">Browse All Quests</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold">{quest.title}</h3>
                      <Badge className={difficultyColors[quest.difficulty as keyof typeof difficultyColors]}>
                        {quest.difficulty}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${quest.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Reward:</span>
                        <span className="font-semibold">{quest.reward}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Time left:</span>
                        <span>{quest.timeLeft}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Participants:</span>
                        <span>{quest.participants}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={guildColors[quest.guild as keyof typeof guildColors]}>{quest.guild}</Badge>
                      <Button size="sm">{quest.progress > 0 ? 'Continue' : 'Start Quest'}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Community Leaderboard</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    This Week
                  </Button>
                  <Button variant="outline" size="sm">
                    This Month
                  </Button>
                  <Button size="sm">All Time</Button>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-border/50 text-sm font-semibold text-muted-foreground">
                  <div>Rank</div>
                  <div className="col-span-2">Member</div>
                  <div>Guild</div>
                  <div>XP</div>
                  <div>Badges</div>
                </div>

                {leaderboard.map((member) => (
                  <div
                    key={member.rank}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">#{member.rank}</span>
                      {member.change === 'up' && <Zap className="w-3 h-3 text-green-500" />}
                      {member.change === 'down' && <Zap className="w-3 h-3 text-red-500 rotate-180" />}
                    </div>

                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{member.username.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="font-semibold">{member.username}</span>
                    </div>

                    <div>
                      <Badge className={guildColors[member.guild as keyof typeof guildColors]} variant="outline">
                        {member.guild.split(' ')[0]}
                      </Badge>
                    </div>

                    <div className="font-semibold">{member.xp.toLocaleString()}</div>

                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{member.badges}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="mt-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect with like-minded Web3 enthusiasts, participate in exclusive events, and earn rewards for your
              contributions to the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Join Discord
              </Button>
              <Button variant="outline" size="lg">
                View Community Guidelines
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
