'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-guard'
import { User, Target, Calendar, Award, TrendingUp, Copy, Settings } from 'lucide-react'

const mockUserData = {
  username: 'CryptoNinja',
  walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  guild: 'DeFi & Airdrops',
  joinDate: '2024-10-15',
  xp: 8420,
  level: 12,
  badges: [
    { name: 'Early Adopter', icon: '🚀', rarity: 'Legendary' },
    { name: 'DeFi Master', icon: '💎', rarity: 'Rare' },
    { name: 'Community Helper', icon: '🤝', rarity: 'Common' },
    { name: 'Quest Completer', icon: '✅', rarity: 'Uncommon' },
  ],
  stats: {
    questsCompleted: 23,
    eventsAttended: 12,
    referrals: 5,
    daysActive: 67,
  },
}

const recentActivity = [
  {
    type: 'quest_complete',
    title: 'Completed "DeFi Explorer" quest',
    reward: '+500 XP',
    time: '2 hours ago',
    icon: Target,
  },
  {
    type: 'event_attend',
    title: 'Attended "Yield Farming Masterclass"',
    reward: '+200 XP',
    time: '1 day ago',
    icon: Calendar,
  },
  {
    type: 'badge_earned',
    title: 'Earned "Community Helper" badge',
    reward: 'New Badge',
    time: '3 days ago',
    icon: Award,
  },
  {
    type: 'level_up',
    title: 'Leveled up to Level 12',
    reward: 'New Perks',
    time: '5 days ago',
    icon: TrendingUp,
  },
]

const upcomingEvents = [
  {
    title: 'DeFi Strategy Session',
    date: '2024-12-28',
    time: '15:00 UTC',
    type: 'Guild Event',
    restricted: true,
  },
  {
    title: 'Community AMA',
    date: '2024-12-29',
    time: '18:00 UTC',
    type: 'General',
    restricted: false,
  },
  {
    title: 'Trading Workshop',
    date: '2025-01-02',
    time: '16:00 UTC',
    type: 'Workshop',
    restricted: false,
  },
]

const activeQuests = [
  {
    title: 'Referral Champion',
    description: 'Refer 5 new members to earn exclusive rewards',
    progress: 60,
    reward: '1000 XP + Rare Badge',
    timeLeft: '10 days',
  },
  {
    title: 'Knowledge Seeker',
    description: 'Complete 3 educational modules',
    progress: 33,
    reward: '750 XP + Certificate',
    timeLeft: '15 days',
  },
]

const guildColors = {
  'Trader/HODLers': 'bg-green-500/20 text-green-400',
  'DeFi & Airdrops': 'bg-blue-500/20 text-blue-400',
  'NFTs & Gaming': 'bg-purple-500/20 text-purple-400',
  Developer: 'bg-orange-500/20 text-orange-400',
  Careers: 'bg-indigo-500/20 text-indigo-400',
}

const rarityColors = {
  Common: 'bg-gray-500/20 text-gray-300',
  Uncommon: 'bg-green-500/20 text-green-400',
  Rare: 'bg-blue-500/20 text-blue-400',
  Epic: 'bg-purple-500/20 text-purple-400',
  Legendary: 'bg-orange-500/20 text-orange-400',
}

export function MemberDashboard() {
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'events' | 'profile'>('overview')

  // Suppress unused variable warning for now
  void auth

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {mockUserData.username}!</h1>
                <p className="text-zinc-400">Member since {new Date(mockUserData.joinDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={guildColors[mockUserData.guild as keyof typeof guildColors]} variant="outline">
                  {mockUserData.guild}
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{mockUserData.level}</div>
              <div className="text-sm text-zinc-400">Level</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{mockUserData.xp.toLocaleString()}</div>
              <div className="text-sm text-zinc-400">Total XP</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{mockUserData.badges.length}</div>
              <div className="text-sm text-zinc-400">Badges</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{mockUserData.stats.daysActive}</div>
              <div className="text-sm text-zinc-400">Days Active</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-2">
              <div className="flex gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'quests', label: 'Quests', icon: Target },
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'profile', label: 'Profile', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'quests' | 'events' | 'profile')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-zinc-400 hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <activity.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-zinc-400">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {activity.reward}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Badges */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Latest Badges</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mockUserData.badges.slice(0, 4).map((badge, index) => (
                      <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">{badge.icon}</div>
                        <div className="text-sm font-semibold mb-1">{badge.name}</div>
                        <Badge className={rarityColors[badge.rarity as keyof typeof rarityColors]} variant="outline">
                          {badge.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Quests Completed</span>
                      <span className="font-semibold">{mockUserData.stats.questsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Events Attended</span>
                      <span className="font-semibold">{mockUserData.stats.eventsAttended}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Referrals</span>
                      <span className="font-semibold">{mockUserData.stats.referrals}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quests' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Active Quests</h2>
                <Button variant="outline">Browse All Quests</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeQuests.map((quest, index) => (
                  <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-3">{quest.title}</h3>
                    <p className="text-zinc-400 mb-4">{quest.description}</p>

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

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-zinc-400">Reward</div>
                        <div className="font-semibold">{quest.reward}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-zinc-400">Time left</div>
                        <div className="font-semibold">{quest.timeLeft}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
                <Button variant="outline">View Calendar</Button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span>
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                          <Badge variant="outline">{event.type}</Badge>
                          {event.restricted && <Badge className="bg-primary/20 text-primary">Guild Only</Badge>}
                        </div>
                      </div>
                      <Button>Join Event</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Profile Settings</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Wallet Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400">Connected Wallet</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-muted px-3 py-2 rounded-lg text-sm flex-1">
                            {formatAddress(mockUserData.walletAddress)}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(mockUserData.walletAddress)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400">Guild</label>
                        <div className="mt-1">
                          <Badge
                            className={guildColors[mockUserData.guild as keyof typeof guildColors]}
                            variant="outline"
                          >
                            {mockUserData.guild}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Display Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400">Display Name</label>
                        <input
                          type="text"
                          defaultValue={mockUserData.username}
                          className="w-full mt-1 px-3 py-2 bg-muted border border-border/50 rounded-lg"
                        />
                      </div>
                      <Button>Update Profile</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">All Badges</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {mockUserData.badges.map((badge, index) => (
                      <div key={index} className="bg-muted/50 border border-border/50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="text-sm font-semibold mb-2">{badge.name}</div>
                        <Badge className={rarityColors[badge.rarity as keyof typeof rarityColors]} variant="outline">
                          {badge.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
