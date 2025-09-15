'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import {
  Shield,
  Code,
  TrendingUp,
  Coins,
  Gamepad2,
  Briefcase,
  Clock,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Wallet,
} from 'lucide-react'

export function VaultLandingV3() {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 6,
    minutes: 24,
    seconds: 24,
  })

  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => ({
        ...prev,
        seconds: prev.seconds > 0 ? prev.seconds - 1 : 59,
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const guilds = [
    {
      id: 'builder',
      name: 'Builder Guild',
      description:
        'Developers, founders, no-code tinkerers, designers, and tech writers who turn ideas into real solutions.',
      icon: Code,
      gradient: 'from-purple-500 via-blue-500 to-cyan-500',
      activities: ['Weekly build labs & reviews', 'Tool credits & starter kits', 'Ship logs & portfolio boosts'],
      classTime: 'Open Class: Fri 8:00 PM PH',
    },
    {
      id: 'trader',
      name: 'Trader Guild',
      description:
        'Process-first traders and long-term holders focused on strategy, discipline, and top-tier opportunities.',
      icon: TrendingUp,
      gradient: 'from-pink-500 via-orange-500 to-yellow-500',
      activities: ['Playbooks for entries/exits', 'Risk & journaling systems', 'Weekly market rooms'],
      classTime: 'Open Class: Wed 9:30 PM PH',
    },
    {
      id: 'farmer',
      name: 'Farmer Guild',
      description: 'DeFi & airdrop farmers who run bridges, staking, LPs, testnets—safely and consistently.',
      icon: Coins,
      gradient: 'from-cyan-500 via-teal-500 to-green-500',
      activities: ['DeFi checklists & trackers', 'Airdrop calendars', "Security do's & don'ts"],
      classTime: 'Open Class: Tue 8:00 PM PH',
    },
    {
      id: 'gamer',
      name: 'Gamer Guild',
      description: 'Competitive P2E players & NFT collectors who analyze metas and curate winning collections.',
      icon: Gamepad2,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      activities: ['Meta reports & tier lists', 'Team scrims & VOD reviews', 'Drop radar & tips'],
      classTime: 'Open Class: Sat 4:00 PM PH',
    },
    {
      id: 'pathfinder',
      name: 'Pathfinder Guild',
      description: 'Web3 jobseekers & bounty hunters mapping routes to paid work—research, portfolios, clear pitches.',
      icon: Briefcase,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      activities: ['CV/portfolio clinics', 'Job & bounty board', 'Interview preps'],
      classTime: 'Open Class: Sun 7:00 PM PH',
    },
  ]

  const benefits = [
    { title: 'Expert-led Guilds', description: 'Trusted mentors, small group sessions, and practical playbooks.' },
    { title: 'Progress & Rewards', description: 'Quests, XP, streaks, leaderboards, and weekly givebacks.' },
    { title: 'Jobs & Bounties', description: 'A curated jobs board and paid tasks for proven members.' },
  ]

  const roadmap = [
    { title: 'Kickoff → Foundations', items: ['Mint & Guild Claim', 'AMAs, pilot givebacks', 'Level-Up system'] },
    { title: 'Habits → Proof', items: ['Peer pods & buddy system', 'Quarterly progress report', 'Partner drops'] },
    {
      title: 'Scale → Jobs',
      items: ['Mentor bootcamps', 'Inter-Guild Cup & Bounty Marathon', 'Legendary Unlock Week, Grants Day'],
    },
  ]

  const faqs = [
    { q: 'What is Vault 7641?', a: 'A curated Web3 community focused on education and real opportunities.' },
    { q: 'How do I get on the whitelist?', a: 'Three paths: Progress WL, Community WL, or Safety WL.' },
    { q: 'When is mint?', a: 'Date announced 7 days before. WL gets 48h priority access.' },
    { q: 'What do holders unlock?', a: 'Guild access, educational content, jobs board, and rewards.' },
    { q: 'Is this financial advice?', a: 'No. Membership collectible only. Not investment advice.' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="pb-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-6 inline-flex items-center gap-2">
                🚀 Pre-Mint • PH-first
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Your crypto homebase in the </span>
                <span className="text-white">Philippines.</span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                Progress over Hype. Choose a Guild, finish quests, and earn access. Learn → Check → Do.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Join Discord
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-3 rounded-xl font-semibold"
                >
                  View Guilds
                </Button>
              </div>

              {/* Countdown */}
              <div className="inline-block">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-900" />
                  </div>
                  <span className="text-lg font-semibold text-white">MINT WEEK COUNTDOWN</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'DAYS', value: timeLeft.days },
                    { label: 'HOURS', value: timeLeft.hours },
                    { label: 'MIN', value: timeLeft.minutes },
                    { label: 'SEC', value: timeLeft.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-zinc-950/80 border border-zinc-700/50 rounded-2xl p-5 text-center min-w-[80px]"
                    >
                      <div className="text-2xl font-bold text-white mb-1">{item.value.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-white font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vault Illustration */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="relative">
                  <Image
                    src="/Cube_v2.png"
                    alt="Vault 7641 - Isometric view of different guild spaces with members collaborating"
                    width={800}
                    height={800}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-sm font-semibold text-purple-500">HOW IT WORKS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Mint your Base Pass</h3>
                <p className="text-sm text-zinc-400">Secure your spot for Season 1 and unlock member perks.</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Choose your Guild</h3>
                <p className="text-sm text-zinc-400">You have 72h to finalize. Claim your PFP and badge.</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Verify & Start Quests</h3>
                <p className="text-sm text-zinc-400">Join Discord, verify, then Learn → Check → Do.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Guilds Section */}
      <div id="guilds" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-semibold text-green-500">THE GUILDS</span>
          </div>

          {/* First Row - 3 Guilds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {guilds.slice(0, 3).map((guild) => (
              <Card
                key={guild.id}
                className="bg-zinc-950/50 border-zinc-800 group relative overflow-hidden hover:scale-105 transition-all cursor-pointer"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${guild.gradient}`} />

                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                      <Image
                        src={`/${guild.id.charAt(0).toUpperCase() + guild.id.slice(1)}_logo.jpg`}
                        alt={`${guild.name} Logo`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white">{guild.name}</h3>
                  </div>

                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{guild.description}</p>

                  <div className="space-y-2 mb-6">
                    {guild.activities.map((activity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-1 h-1 bg-white rounded-full mr-3 flex-shrink-0" />
                        <span className="text-zinc-300">{activity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button className="w-full text-left text-sm text-cyan-400 hover:text-cyan-300">
                      Preview quest →
                    </button>
                    <div className="text-xs text-zinc-500">{guild.classTime}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Second Row - 2 Guilds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guilds.slice(3, 5).map((guild) => (
              <Card
                key={guild.id}
                className="bg-zinc-950/50 border-zinc-800 group relative overflow-hidden hover:scale-105 transition-all cursor-pointer"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${guild.gradient}`} />

                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                      <Image
                        src={`/${guild.id.charAt(0).toUpperCase() + guild.id.slice(1)}_logo.jpg`}
                        alt={`${guild.name} Logo`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white">{guild.name}</h3>
                  </div>

                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{guild.description}</p>

                  <div className="space-y-2 mb-6">
                    {guild.activities.map((activity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-1 h-1 bg-white rounded-full mr-3 flex-shrink-0" />
                        <span className="text-zinc-300">{activity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button className="w-full text-left text-sm text-cyan-400 hover:text-cyan-300">
                      Preview quest →
                    </button>
                    <div className="text-xs text-zinc-500">{guild.classTime}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Member Benefits */}
      <div className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm font-semibold text-yellow-500">MEMBER BENEFITS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-zinc-950/50 border-zinc-800">
                <CardContent>
                  <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-sm text-zinc-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Season Roadmap */}
      <div className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
            <span className="text-sm font-semibold text-pink-500">SEASON ROADMAP (S1)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {roadmap.map((phase, index) => (
              <Card key={index} className="bg-zinc-950/50 border-zinc-800">
                <CardContent>
                  <h3 className="text-lg font-bold text-white mb-4">{phase.title}</h3>
                  <div className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-sm">
                        <div className="w-1 h-1 bg-white rounded-full mr-3 flex-shrink-0" />
                        <span className="text-zinc-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partners */}
          {/* <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-semibold text-green-500">PARTNERS & KOLS</span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <Card key={i} className="bg-zinc-950/50 border-zinc-800 aspect-square">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  <span className="text-xs font-semibold text-zinc-500">Logo {i + 1}</span>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm font-semibold text-yellow-500">FAQ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index
              return (
                <Card key={index} className="bg-zinc-950/50 border-zinc-800 overflow-hidden ">
                  <button
                    className="w-full text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                  >
                    <span className="font-semibold text-white pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-zinc-800 pt-4">
                        <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Status & Safety Section */}
      {/* <div id="status" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-500">Status: All systems operational</span>
            </div>
            <button className="text-sm text-cyan-400 hover:text-cyan-300">JSON Feed</button>
          </div>

          <Card className="bg-zinc-950/50 border-zinc-800">
            <CardContent>
              <h3 className="text-lg font-bold text-white mb-4">Safety Center</h3>
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Official Links:</strong> website • Discord • Twitter (verify here
                    before clicking elsewhere)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Admins will never DM first.</strong> Beware of lookalike accounts.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0" />
                  <span>Report phishing sites or impersonators via the form (response within 24h).</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
  )
}
