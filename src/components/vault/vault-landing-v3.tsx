'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GuildCard } from './guild-card'
import { Users, Target, TrendingUp } from 'lucide-react'
import { ExpertsCarousel } from './experts-carousel-v2'
import Image from 'next/image'
import { SOCIAL_LINKS } from '@/lib/constants'

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
        'For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities, and a supportive circle led by Licensed Financial/Investment Analysts, Certified Technical Analysts, and Full-time Traders.',
      gradient: 'from-orange-400 via-orange-600 to-red-700',
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
      gradient: 'from-lime-600 via-green-900 to-green-600',
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
      gradient: 'from-fuchsia-600 via-violet-900 to-fuchsia-900',
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

  const roadmap = [
    {
      title: 'Phase 1: Mint & Kickoff',
      items: [
        'Core Discord "Features" Launch',
        'Vault University (Advanced Academy) Pilot',
        'Guild Quest System Launch',
      ],
    },
    {
      title: 'Phase 2: Build Habits & Early Wins',
      items: ['Pilot bounties and short-term contracts', 'Community Points System', 'Pilot Website Edu Platform'],
    },
    {
      title: 'Phase 3: Proof & Case Studies',
      items: [
        'Peer Pods & Buddy System',
        'Member Success Stories',
        'Case Study Creation',
        'Guild Achievement Tracking',
        'Proof-of-Work Documentation',
        'Quarter 1 Report',
      ],
    },
    {
      title: 'Phase 4: Grow Reach Safely',
      items: [
        'Pilot Mentorship Programs',
        'Vetted Partner Network',
        'Safe Growth Initiatives',
        'Cross-Guild Collaborations',
        'Regional Community Expansion',
        'Launch Advanced Referral Program',
        'Trust & Safety Framework',
      ],
    },
    {
      title: 'Phase 5: Turn Skills into $$$',
      items: [
        'Partner Jobs Board Launch',
        'Paid Task Marketplace',
        'Client Network Access',
        'Creator Drop #1',
        'Freelance Success Path',
      ],
    },
    {
      title: 'Phase 6: Mid-season',
      items: [
        'Guild Milestone Awards',
        'Expert Course Library',
        'Inter-Guild Cup',
        'Elite Mentorship Tracks',
        'Bounty Marathon',
        'Progress Report & Review',
        'Quarter 2 Report',
      ],
    },
    {
      title: 'Phase 7: Level Up',
      items: [
        'Master Class Series',
        'Specialist Status Program',
        'Specialized Training Paths',
        'Legendary Unlock Week',
        'Pilot P2P Program',
      ],
    },
    {
      title: 'Phase 8: Reach New Audience',
      items: [
        'Global Guild Events',
        'Content Creator Program',
        'Community Workshops',
        'Multi-Language Support',
        'Regional Hub Expansion',
        'Campus and OFW Virtual Tours',
        'Creator Drop #2',
      ],
    },
    {
      title: 'Phase 9: Get Hired',
      items: [
        'Career Fair Events',
        'Resume Workshop Series',
        'Mock Interview Program',
        'Employer Partnerships',
        'Placement Support',
        'Career Mentorship',
        'Quarter 3 Report',
      ],
    },
    {
      title: 'Phase 10: Community Power-Up',
      items: [
        'Guild Governance System',
        'Community-Led Projects',
        'Partner Demo Day',
        'Local Chapter Program',
        'Community Grants Day',
        'Guild Showcase Week',
      ],
    },
    {
      title: 'Phase 11: Push to Close',
      items: [
        'Season Finale Events',
        'Achievement Celebrations',
        'Major Partner Reveals',
        'Special Rewards Unlock',
        'Success Story Showcase',
        'Next Season Preview',
      ],
    },
    {
      title: 'Phase 12: Season 1 End',
      items: [
        'Annual Awards Night',
        'Season 1 Completion NFTs',
        'Performance Analytics',
        'Community Impact Report',
        'Season 2 Roadmap',
        'Legacy Member Benefits',
        'Annual Report',
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
                <span className="text-white">Your Crypto Homebase in the </span>
                <span className="text-white">Philippines.</span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
                {/* Progress over Hype. Choose a Guild, finish quests, and earn access. Learn → Check → Do. */}A winning
                community led by experts & professionals. Learn safely, gain skills, unlock opportunities.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
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
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="relative">
                  <Image
                    src="/Vault_square_1.png"
                    alt="Vault 7641 - Isometric view of different guild spaces with members collaborating"
                    width={800}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Up */}
      <div id="level-up" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-sm font-semibold text-purple-500">LEVEL UP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Real Help From Real Experts</h3>
                <p className="text-sm text-zinc-400">
                  Learn & Grow with Top Crypto Analysts & Traders on a daily basis. Enroll in our FREE Academy.
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

          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="step-1" className="border-none">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-white hover:no-underline hover:bg-zinc-800/50 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-purple-400/20 flex-shrink-0">
                          1
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-white">Mint a Pass</h3>
                          <p className="text-sm text-zinc-400 font-normal">
                            Your Pass is a digital membership card to the Vault.
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-sm text-zinc-400 mb-4">
                          &ldquo;Minting&rdquo; means creating your own copy of the pass on the blockchain. You keep it
                          in your crypto wallet. The Pass unlocks access to our Guilds, exclusive channels, classes,
                          resources, quests, and perks. It&apos;s an access collectible, not an investment.
                        </p>
                        <p className="text-xs text-zinc-500">
                          Need help? Open a help ticket in our Discord or email support@vault7641.com
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="step-2" className="border-none">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-white hover:no-underline hover:bg-zinc-800/50 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-yellow-400/20 flex-shrink-0">
                          2
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-white">Choose a Guild</h3>
                          <p className="text-sm text-zinc-400 font-normal">Pick the path that fits your goals.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-sm text-zinc-400 mb-4">
                          You can preview each Guild in Discord before you decide. 1 Pass = 1 Guild of choice.
                        </p>
                        <p className="text-xs text-zinc-500">
                          Need help? Open a help ticket in our Discord or email support@vault7641.com
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="step-3" className="border-none">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-white hover:no-underline hover:bg-zinc-800/50 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-green-400/20 flex-shrink-0">
                          3
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-white">Learn, Earn, and Grow</h3>
                          <p className="text-sm text-zinc-400 font-normal">
                            Follow our proven Learn → Check → Do framework.
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-sm text-zinc-400 mb-4">
                          Learn from short lessons & quizzes, practical quests (Learn → Check → Do), weekly open
                          classes, and join peer pods.
                        </p>
                        <p className="text-xs text-zinc-500">
                          Need help? Open a help ticket in our Discord or email support@vault7641.com
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Experts Carousel */}
      <ExpertsCarousel />

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
      <div id="roadmap" className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
              <span className="text-sm font-semibold text-pink-500">ROADMAP</span>
            </div>
            <div className="flex items-center gap-2 text-pink-500/70">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 8l4 4-4 4M7 8L3 12l4 4" />
              </svg>
              <span className="text-xs font-medium">Drag to explore</span>
            </div>
          </div>

          <div
            className="relative min-h-[700px]"
            onMouseDown={(e: React.MouseEvent) => {
              const slider = e.currentTarget.querySelector('.overflow-x-auto') as HTMLDivElement
              if (!slider) return

              const startX = e.pageX
              const scrollLeft = slider.scrollLeft
              let isDragging = true
              let lastX = startX
              let frameId: number

              const smoothScroll = () => {
                if (!isDragging) return
                const delta = lastX - startX
                const targetScroll = scrollLeft - delta
                const currentScroll = slider.scrollLeft
                const diff = targetScroll - currentScroll

                // Apply easing to the scroll
                slider.scrollLeft += diff * 0.15
                frameId = requestAnimationFrame(smoothScroll)
              }

              const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging) return
                e.preventDefault()
                lastX = e.pageX
                if (!frameId) {
                  frameId = requestAnimationFrame(smoothScroll)
                }
              }

              const handleMouseUp = () => {
                isDragging = false
                if (frameId) {
                  cancelAnimationFrame(frameId)
                  frameId = 0
                }
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <div className="absolute left-0 top-[50%] w-24 h-[2px] bg-gradient-to-r from-zinc-950 to-transparent z-30" />
            <div className="absolute right-0 top-[50%] w-24 h-[2px] bg-gradient-to-l from-zinc-950 to-transparent z-30" />

            {/* Scroll Indicators */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 text-pink-500/70">
              <div className="w-8 h-8 rounded-full bg-pink-500/5 border border-pink-500/20 flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 text-pink-500/70">
              <div className="w-8 h-8 rounded-full bg-pink-500/5 border border-pink-500/20 flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>

            <div
              className="overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none group"
              style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <style>
                {`
                  .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}
              </style>
              <div className="relative flex gap-6 min-w-max px-4 py-[400px]">
                {/* Timeline line */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-pink-500/50" />

                {roadmap.map((phase, index) => (
                  <div key={index} className="relative w-[300px]">
                    {/* Card wrapper with margin for spacing */}
                    <div className={`absolute w-full ${index % 2 === 0 ? 'bottom-[50%] mb-8' : 'top-[50%] mt-8'}`}>
                      {/* Connecting line */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 ${
                          index % 2 === 0 ? 'bottom-0 translate-y-full' : 'top-0 -translate-y-full'
                        } w-[2px] h-8 bg-gradient-to-b ${
                          index % 2 === 0 ? 'from-transparent to-pink-500/50' : 'from-pink-500/50 to-transparent'
                        }`}
                      />

                      <Card
                        className={`${index === 0 ? 'bg-pink-500/10 border-pink-500/30' : 'bg-zinc-950/50 border-zinc-800/50'} backdrop-blur-sm h-[350px] flex flex-col`}
                      >
                        <CardContent className="flex flex-col h-full">
                          <div className="mb-4 flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full border flex-shrink-0 ${index === 0 ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-pink-500/30 bg-pink-500/10 text-pink-400'} flex items-center justify-center text-lg font-bold`}
                            >
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-bold text-white line-clamp-2">{phase.title}</h3>
                          </div>
                          <div className="space-y-2 overflow-y-auto flex-grow scrollbar-hide">
                            {phase.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center text-sm group">
                                <div className="w-1 h-1 bg-pink-500/50 rounded-full mr-3 flex-shrink-0 group-hover:bg-pink-400 transition-colors" />
                                <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Carousel */}
      {/* <PartnersCarousel /> */}

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
