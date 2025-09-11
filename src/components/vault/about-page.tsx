'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Shield, Zap, LinkedinIcon, TwitterIcon, ExternalLink } from 'lucide-react'

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    guild: 'Trader/HODLers',
    bio: 'Former Goldman Sachs trader with 8+ years in traditional finance. Led DeFi adoption at major crypto funds.',
    expertise: ['Trading Strategy', 'Risk Management', 'Market Analysis'],
    avatar: '/team/alex.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Sarah Kim',
    role: 'Head of DeFi',
    guild: 'DeFi & Airdrops',
    bio: 'DeFi researcher and yield farmer. Previously at Compound Labs, expert in protocol analysis and tokenomics.',
    expertise: ['DeFi Protocols', 'Yield Optimization', 'Tokenomics'],
    avatar: '/team/sarah.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Marcus Rodriguez',
    role: 'NFT & Gaming Lead',
    guild: 'NFTs & Gaming',
    bio: 'Early NFT collector and gaming entrepreneur. Founded multiple successful Web3 gaming projects.',
    expertise: ['NFT Analysis', 'Gaming Economies', 'Community Building'],
    avatar: '/team/marcus.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'David Park',
    role: 'Lead Developer',
    guild: 'Developer',
    bio: 'Solana core contributor and smart contract auditor. Built infrastructure for top-tier DeFi protocols.',
    expertise: ['Solana Development', 'Smart Contracts', 'Security Audits'],
    avatar: '/team/david.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Lisa Wang',
    role: 'Head of Careers',
    guild: 'Careers',
    bio: 'Former tech recruiter at Google and Meta. Specialized in Web3 talent acquisition and career development.',
    expertise: ['Talent Acquisition', 'Career Coaching', 'Industry Connections'],
    avatar: '/team/lisa.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'James Thompson',
    role: 'Community Manager',
    guild: 'All Guilds',
    bio: 'Community builder with 5+ years managing Discord servers for major crypto projects. Expert in engagement.',
    expertise: ['Community Management', 'Discord Operations', 'Event Planning'],
    avatar: '/team/james.jpg',
    social: {
      twitter: '#',
      linkedin: '#',
    },
  },
]

const partners = [
  {
    name: 'Solana Foundation',
    type: 'Ecosystem Partner',
    description: 'Supporting Solana ecosystem growth and education',
    logo: '/partners/solana.svg',
  },
  {
    name: 'Magic Eden',
    type: 'NFT Marketplace',
    description: 'Premier NFT marketplace partnership for exclusive drops',
    logo: '/partners/magic-eden.svg',
  },
  {
    name: 'Jupiter',
    type: 'DeFi Partner',
    description: 'DEX aggregation and advanced trading tools',
    logo: '/partners/jupiter.svg',
  },
  {
    name: 'Phantom',
    type: 'Wallet Partner',
    description: 'Seamless wallet integration and user experience',
    logo: '/partners/phantom.svg',
  },
  {
    name: 'Helius',
    type: 'Infrastructure',
    description: 'RPC infrastructure and developer tools',
    logo: '/partners/helius.svg',
  },
  {
    name: 'Dialect',
    type: 'Communication',
    description: 'Web3 messaging and notification infrastructure',
    logo: '/partners/dialect.svg',
  },
]

const values = [
  {
    icon: Target,
    title: 'Education First',
    description:
      'We believe knowledge is the foundation of successful Web3 participation. Every resource is designed to genuinely help our members grow.',
  },
  {
    icon: Shield,
    title: 'Transparency',
    description:
      "No hidden agendas or pump schemes. We're transparent about our operations, partnerships, and how we generate value for the community.",
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Our roadmap and features are shaped by member feedback. The community decides what matters most for their Web3 journey.',
  },
  {
    icon: Zap,
    title: 'Real Utility',
    description:
      'Every feature and benefit provides genuine value. No empty promises or speculative hype—just tools that help you succeed.',
  },
]

const milestones = [
  { year: '2023', title: 'Foundation', description: 'Vault 7641 concept developed by core team' },
  { year: 'Q1 2024', title: 'Community Building', description: 'Discord launch and initial member onboarding' },
  { year: 'Q2 2024', title: 'Educational Content', description: 'First video series and research reports published' },
  { year: 'Q3 2024', title: 'Guild System', description: 'Specialized guild structure and expert leadership' },
  { year: 'Q4 2024', title: 'NFT Launch', description: 'Base Pass mint and PFP claim system' },
  { year: '2025', title: 'Platform Evolution', description: 'Advanced tools and cross-chain expansion' },
]

const guildColors = {
  'Trader/HODLers': 'bg-green-500/20 text-green-400',
  'DeFi & Airdrops': 'bg-blue-500/20 text-blue-400',
  'NFTs & Gaming': 'bg-purple-500/20 text-purple-400',
  Developer: 'bg-orange-500/20 text-orange-400',
  Careers: 'bg-indigo-500/20 text-indigo-400',
  'All Guilds': 'bg-muted text-zinc-400',
}

export function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Vault 7641</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              We&apos;re building the most valuable Web3 community by focusing on real education, genuine utility, and
              meaningful connections. No hype, just results.
            </p>
          </div>

          {/* Story Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Vault 7641 was born from frustration with the Web3 space&apos;s focus on speculation over education.
                  Our founding team, coming from traditional finance, tech, and crypto backgrounds, saw talented people
                  losing money due to lack of proper guidance and community support.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  We decided to build something different: a community that prioritizes learning, provides real tools,
                  and connects members with opportunities that actually matter. Every feature we build, every
                  partnership we form, and every piece of content we create is designed to genuinely help our members
                  succeed in Web3.
                </p>
                <p className="text-lg leading-relaxed">
                  The name &quot;Vault 7641&quot; represents our commitment to being a secure repository of knowledge
                  and opportunities. The number 7641 reflects our total supply—a deliberately small, focused community
                  where every member matters and contributes to the collective success.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Guild Leaders & Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-zinc-400 mb-2">{member.role}</p>
                    <Badge className={guildColors[member.guild as keyof typeof guildColors]} variant="outline">
                      {member.guild}
                    </Badge>
                  </div>

                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{member.bio}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <TwitterIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <LinkedinIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Partners Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-zinc-400">
                        {partner.name.split(' ')[0].slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{partner.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {partner.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400">{partner.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 md:text-right md:pr-8">
                      {index % 2 !== 0 && (
                        <div className="hidden md:block">
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-zinc-400">{milestone.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                      <div className="absolute -top-1 left-12 md:left-1/2 md:transform md:-translate-x-1/2 md:-top-8 whitespace-nowrap">
                        <Badge className="bg-primary/20 text-primary border-primary/30">{milestone.year}</Badge>
                      </div>
                    </div>

                    <div className="flex-1 md:pl-8">
                      <div className="md:hidden">
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-zinc-400">{milestone.description}</p>
                      </div>
                      {index % 2 === 0 && (
                        <div className="hidden md:block">
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-zinc-400">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Careers Section */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                We&apos;re always looking for passionate individuals who share our vision of making Web3 education and
                community accessible to everyone. Join us in building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  View Open Positions
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
