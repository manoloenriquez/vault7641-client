'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Users, Shield, CheckCircle, Target, MessageCircle, ExternalLink } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

const wlPaths = [
  {
    id: 'progress',
    title: 'Progress WL',
    description: 'Earn 60 points through events & quests',
    icon: Trophy,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    requirements: [
      'Join Discord server (+10 points)',
      'Complete guild preview quest (+15 points)',
      'Attend 2 community events (+20 points)',
      'Refer 1 new member (+15 points)',
    ],
    timeframe: 'Ongoing until WL closes',
    difficulty: 'Active Participation',
    spots: '3,000 spots available',
  },
  {
    id: 'community',
    title: 'Community WL',
    description: 'Recognition for valuable community contributions',
    icon: Users,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    requirements: [
      'Outstanding community help',
      'Quality content creation',
      'Event organization assistance',
      'Nominated by guild leaders',
    ],
    timeframe: 'Reviewed weekly',
    difficulty: 'High Value Contribution',
    spots: '1,500 spots available',
  },
  {
    id: 'safety',
    title: 'Safety WL',
    description: 'Reward for helping protect the community',
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    requirements: [
      'Report verified scams (+20 points)',
      'Help members avoid fraud (+15 points)',
      'Share security best practices (+10 points)',
      'Assist in takedown efforts (+25 points)',
    ],
    timeframe: 'Immediate upon verification',
    difficulty: 'Community Protection',
    spots: '500 spots available',
  },
]

const wlRules = [
  {
    title: 'Proof Requirements',
    items: [
      'Discord verification with wallet connection required',
      'All activities must be completed with the same wallet',
      'Screenshots or Discord message links as proof',
      'No retroactive credit for activities before joining',
    ],
  },
  {
    title: 'Wallet Form Timeline',
    items: [
      'Wallet submission form opens 48h before mint',
      'Must submit wallet address used for WL activities',
      'One wallet per person, verified through Discord',
      'Late submissions not accepted',
    ],
  },
  {
    title: 'Guild Changes',
    items: [
      'Can change guild preference until T-1 (1 day before mint)',
      'Guild selection affects WL priority order',
      'Popular guilds may have higher requirements',
      'Final guild choice made after mint (72h window)',
    ],
  },
  {
    title: 'Key Rules (48h Window)',
    items: [
      'WL spots are non-transferable',
      'Must mint within 48h of WL opening',
      'Unused WL spots released to public mint',
      'No guaranteed allocation - first come, first served',
    ],
  },
]

const mockUserProgress = {
  currentPoints: 35,
  requiredPoints: 60,
  completedTasks: [
    { task: 'Joined Discord', points: 10, completed: true },
    { task: 'Guild Preview Quest', points: 15, completed: true },
    { task: 'First Community Event', points: 10, completed: true },
    { task: 'Second Community Event', points: 0, completed: false },
    { task: 'Member Referral', points: 15, completed: false },
  ],
}

export function HowToWLPage() {
  const progressPercentage = (mockUserProgress.currentPoints / mockUserProgress.requiredPoints) * 100

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">How to Get Whitelisted</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Three paths to secure your priority access to Vault 7641. Choose the path that fits your strengths and
              start earning your spot today.
            </p>
          </div>

          {/* User Progress (if applicable) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Check Points in Discord
              </Button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progress WL Points</span>
                <span className="font-bold">
                  {mockUserProgress.currentPoints} / {mockUserProgress.requiredPoints} points
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-center mt-2">
                <span className={`text-lg font-bold ${progressPercentage >= 100 ? 'text-green-500' : 'text-primary'}`}>
                  {progressPercentage.toFixed(0)}%
                </span>
                <span className="text-sm text-zinc-400 ml-1">{progressPercentage >= 100 ? 'WL Earned!' : 'to WL'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockUserProgress.completedTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      task.completed ? 'bg-green-500 text-white' : 'bg-muted text-zinc-400 border border-border'
                    }`}
                  >
                    {task.completed ? <CheckCircle className="w-3 h-3" /> : '○'}
                  </div>
                  <span className={task.completed ? 'line-through text-zinc-400' : ''}>{task.task}</span>
                  <span className="text-primary font-semibold">+{task.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WL Paths */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">3 Paths to Whitelist</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {wlPaths.map((path) => (
                <div
                  key={path.id}
                  className={`bg-card/50 backdrop-blur-sm border ${path.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
                >
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 ${path.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 border ${path.borderColor}`}
                    >
                      <path.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-sm text-zinc-400">{path.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {path.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Timeline:</span>
                      <span className="font-semibold">{path.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Difficulty:</span>
                      <Badge variant="outline">{path.difficulty}</Badge>
                    </div>
                    <div className="text-center pt-3 border-t border-border/50">
                      <span className="text-primary font-bold">{path.spots}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WL Rules & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {wlRules.map((section, index) => (
              <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Section */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning WL?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Join our Discord community and start participating in events and quests. The sooner you start, the better
              your chances of securing priority access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                asChild
              >
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                  Join Discord Now
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg">
                Check Your Points
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="font-bold mb-3">When does the wallet form open?</h4>
                <p className="text-sm text-zinc-400">
                  The wallet submission form opens exactly 48 hours before the mint begins. You&apos;ll need to submit
                  the same wallet address you used for WL activities.
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="font-bold mb-3">Can I change my guild before mint?</h4>
                <p className="text-sm text-zinc-400">
                  Yes! You can change your guild preference until T-1 (1 day before mint). This affects your WL priority
                  order within your point tier.
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="font-bold mb-3">What counts as proof for activities?</h4>
                <p className="text-sm text-zinc-400">
                  Discord verification, event attendance records, quest completion screenshots, and referral
                  confirmations. All tracked automatically in our Discord bot.
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="font-bold mb-3">How long do I have to mint with WL?</h4>
                <p className="text-sm text-zinc-400">
                  You have exactly 48 hours from WL mint opening. After that, unused spots are released to public mint
                  on a first-come, first-served basis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
