'use client'

import { GuildPreviewTemplate } from '@/components/vault/guild-preview-template'
import { Briefcase } from 'lucide-react'

const pathfinderData = {
  id: 'pathfinder',
  name: 'Pathfinder',
  description: 'Web3 career seekers and bounty hunters',
  whoItIsFor:
    'For Web3 career seekers and bounty hunters mapping routes to paid work—researching teams, prepping portfolios, pitching clearly, and delivering safely.',
  icon: Briefcase,
  color: 'from-indigo-500 to-purple-600',
  bgColor: 'bg-indigo-500/10',
  borderColor: 'border-indigo-500/20',
  weeklyActivities: ['Career Coaching Sessions', 'Portfolio Reviews', 'Industry Networking'],
  foundingQuests: [
    {
      title: 'Web3 Portfolio Audit',
      description: 'Submit your current portfolio/resume for professional review and improvement suggestions',
      reward: '+15 WL Points',
      difficulty: 'Beginner',
      timeEstimate: '30-45 mins',
    },
    {
      title: 'Bounty Hunter Challenge',
      description: 'Complete a small bounty task from our partner projects and document your process',
      reward: '+30 WL Points',
      difficulty: 'Intermediate',
      timeEstimate: '2-4 hours',
    },
  ],
  nextClass: {
    title: 'Breaking into Web3: From Traditional Tech to Crypto',
    date: '2025-01-02',
    time: '16:00',
    instructor: 'Lisa Wang',
    description:
      'Navigate the transition from traditional tech roles to Web3 careers with insider tips and networking strategies.',
  },
  holderBenefits: [
    'Professional resume and portfolio reviews',
    'Direct networking with hiring partners',
    'Interview preparation and mock sessions',
    'Exclusive bounty and freelance opportunities',
    'Mentorship matching with industry professionals',
    'Career transition guidance and support',
    'Access to private job board and opportunities',
    'Personal branding and LinkedIn optimization',
  ],
}

export default function PathfinderPreview() {
  return <GuildPreviewTemplate guildData={pathfinderData} />
}
