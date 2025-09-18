'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GuildBenefitsPopover } from './guild-benefits-popover'
import { GuildCard } from './guild-card'
import { Users, Target, TrendingUp } from 'lucide-react'
import { ExpertsCarousel } from './experts-carousel-v2'
import { PartnersCarousel } from './partners-carousel-v2'

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 120 // Account for fixed navbar height
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

export function VaultLandingV3() {
  const guilds = [
    {
      id: 'builder',
      name: 'Builder Guild',
      description:
        'For Web3 engineers, designers, data researchers, automators, founders, product designers, anyone who builds & ships.',
      gradient: 'from-yellow-300 via-yellow-500 to-yellow-800',
      activities: [],
      benefits: [
        'Forum board',
        'Build Logs',
        'Code/Design Reviews',
        'RFC (Request for Comments) lane',
        'Advanced learning resources',
        'Direct mentor & expert chats + AMAs',
        'Partner perks',
        'Live sessions + recaps',
      ],
    },
    {
      id: 'trader',
      name: 'Trader Guild',
      description:
        'For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities, and a supportive circle led by Licensed Financial/Investment Analysts, Certified Technical Analysts, and full-time traders.',
      gradient: 'from-pink-500 via-orange-500 to-yellow-500',
      activities: [],
      benefits: [
        'Exclusive Market Insights & Signals',
        'Actionable Trade Setups',
        'Market Watch & News',
        'On-Chain Data & Reports',
        'Community Coaching & Feedback',
        'Market Outlook Newsletters',
        'Whale Watch',
        'Private Research',
        'Track the Projects Our Experts Are Actively Monitoring',
        'Path To Mentorship Program',
        'Self-Paced Advanced Courses & Quizzes',
        'Discussion Rooms with Veteran Traders & Licensed Analysts',
        'Tool Grants',
      ],
    },
    {
      id: 'farmer',
      name: 'Farmer Guild',
      description: 'For DeFi participants, airdrop hunters, points farmers, and yield strategists.',
      gradient: 'from-cyan-500 via-teal-500 to-green-500',
      activities: [],
      benefits: [
        'Alerts & Routes',
        'Walkthroughs',
        'Points Meta',
        'Risk Desk',
        'Cohorts',
        'Advanced resources',
        'Mentor rooms with seasoned farmers',
        'Access exclusive guild chat',
        'Exclusive updates & tips + safety PSAs',
        'Partner perks where aligned',
      ],
    },
    {
      id: 'gamer',
      name: 'Gamer Guild',
      description: 'For P2E gamers, NFT collectors, flippers, and enjoyers of game economies.',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      activities: [],
      benefits: [
        'Mints Today & Exclusive Alpha',
        'Game Nights & Playtests',
        'Flip Desk',
        'Economy Watch',
        'Creator Corner',
        'Advanced resources',
        'Mentor rooms with creators and experts',
        'Access exclusive guild chat',
        'WL/raffle routes with partners when available',
      ],
    },
    {
      id: 'pathfinder',
      name: 'Pathfinder Guild',
      description:
        'For Marketers, CMs, devs, analysts, designers, students, unemployed, and professionals who want Web3 careers, paid tasks/bounties, and resume-worthy credentials.',
      gradient: 'from-cyan-600 via-teal-400 to-cyan-500',
      activities: [],
      benefits: [
        'Curated Job Board',
        'Bounties & Paid Tasks',
        'Application Sprints',
        'Résumé/CV & Portfolio Reviews',
        'Mock Interviews',
        'Referral Network',
        'Proof-of-Work Threads',
        'Opportunity Radar',
        'Advanced resources',
        'Access exclusive guild chat',
        'Partner perks: course discounts, ATS/tool credits, event passes',
        'Early listings & "heads-up" drops',
      ],
    },
  ]

  const faqs = [
    {
      q: 'What is Vault 7641?',
      a: "Vault 7641 is a utility-first Web3 community network led by the leaders of the Philippine Crypto Industry to help members learn, execute, and win across five tracks: Trader • Builder • Gamer • Farmer • Pathfinder (Careers). Inside you'll find our academy, daily briefs, insights, quests, courses, bounties, mentor clinics, and a reward system (XP) tied to real proof-of-work—not spam.",
    },
    {
      q: 'What and when is Mint?',
      a: 'Mint = our membership pass (on-chain) that unlocks holder-only perks and powers our entire system. Date/chain/price: TBA — all details will post in our channels. How it works? Open the official mint link (once available), connect your wallet, and mint from there.',
    },
    {
      q: 'How do I get on the whitelist?',
      a: 'Go to our Discord Server for the full rules and current routes. In short: Verify, choose a guild, and start doing quests. Complete starter quests or Academy Beginner Tracks for eligibility. Submit proof in.',
    },
    {
      q: 'What do holders unlock?',
      a: 'Holders gain full access to all Guild features, including: Vault Academy - Advanced Courses & Curriculum. Guild Holder-only channels & events. Priority access to certain bounties, mentorship seats, and partner allowlists. Exclusive quests with higher XP rewards and shop items. Givebacks, rewards, and grants. Early previews and feature betas. Recognition in leaderboards and spotlights tied to reputation.',
    },
    {
      q: 'Is this financial advice?',
      a: 'No. Everything here is educational. Nothing in this server is financial, investment, legal, or tax advice. Do your own research and only use official links. We never DM first and will never ask for seed phrases, private keys, or 2FA codes.',
    },
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
                🚀 Pre-Mint Phase
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Your crypto homebase in the </span>
                <span className="text-white">Philippines.</span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                Progress over Hype. Choose a Guild, finish quests, and earn access. Learn → Check → Do.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href="https://discord.gg/vault7641" target="_blank" rel="noopener noreferrer">
                    Join Discord
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-3 rounded-xl font-semibold"
                  onClick={() => scrollToSection('guilds')}
                >
                  View Guilds
                </Button>
              </div>
            </div>

            {/* Vault Illustration */}
            {/* <div className="lg:col-span-1">
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
            </div> */}
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
              <GuildCard key={guild.id} {...guild} />
            ))}
          </div>

          {/* Second Row - 2 Guilds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guilds.slice(3, 5).map((guild) => (
              <GuildCard key={guild.id} {...guild} />
            ))}
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
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Real Help from Real Experts</h3>
                <p className="text-sm text-zinc-400">
                  Learn & Grow With Top Crypto Analysts & Traders on a daily basis. Enroll in our FREE Academy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Habits over hype</h3>
                <p className="text-sm text-zinc-400">
                  Built-in gamified system to keep you consistent. Proof of progress {`>`} Hype & Promises.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Turn Skills into Income</h3>
                <p className="text-sm text-zinc-400">
                  Get hired by a Web3 employer or go for bounties, gigs, and roles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Experts Carousel */}
      <ExpertsCarousel />

      {/* Partners Carousel */}
      <PartnersCarousel />

      {/* Member Benefits */}
      {/* <div className="py-4">
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
      </div> */}

      {/* Season Roadmap */}
      {/* <div id="roadmap" className="py-4">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
            <span className="text-sm font-semibold text-pink-500">SEASON ROADMAP (S1)</span>
          </div>

          <div className="space-y-8">
            {roadmap.map((phase, index) => (
              <div
                key={index}
                className="relative pl-8 before:absolute before:left-2 before:top-3 before:h-[calc(100%-12px)] before:w-[1px] before:bg-zinc-800 last:before:hidden"
              >
                <div className="absolute left-0 top-3 h-4 w-4 rounded-full border border-zinc-800 bg-zinc-950"></div>
                <Card className="bg-zinc-950/50 border-zinc-800">
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`phase-${index}`} className="border-none">
                        <AccordionTrigger className="text-lg font-bold text-white hover:no-underline">
                          {phase.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {phase.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center text-sm">
                                <div className="w-1 h-1 bg-white rounded-full mr-3 flex-shrink-0" />
                                <span className="text-zinc-400">{item}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* FAQ */}
      <div id="faq" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm font-semibold text-yellow-500">FAQ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`faq-${index}`} className="border-none">
                      <AccordionTrigger className="px-6 py-4 text-base font-semibold text-white hover:no-underline hover:bg-zinc-800/50">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-sm text-zinc-400">
                        <div className="border-t border-zinc-800 pt-4">{faq.a}</div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
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
