'use client'

import { GuildPreviewTemplate } from '@/components/vault/guild-preview-template'
import { Code } from 'lucide-react'

const builderData = {
  id: 'builder',
  name: 'Builder',
  description: 'Makers who turn ideas into real solutions',
  whoItIsFor:
    'For Developers, founders, no-code tinkerers, designers, and tech writers who like creating useful things.',
  icon: Code,
  color: 'from-orange-500 to-red-600',
  bgColor: 'bg-orange-500/10',
  borderColor: 'border-orange-500/20',
  weeklyActivities: ['Code Review Sessions', 'Technical Deep Dives', 'Founder Office Hours'],
  foundingQuests: [
    {
      title: 'Build Your First Solana dApp',
      description: 'Create a simple Solana program using our starter template and deploy it to devnet',
      reward: '+25 WL Points',
      difficulty: 'Intermediate',
      timeEstimate: '2-3 hours',
    },
    {
      title: 'Contribute to Community Tools',
      description: 'Submit a feature request or bug fix to our open source community tools repository',
      reward: '+15 WL Points',
      difficulty: 'Beginner',
      timeEstimate: '30-45 mins',
    },
  ],
  nextClass: {
    title: 'Solana Smart Contract Fundamentals',
    date: '2024-12-29',
    time: '20:00',
    instructor: 'David Park',
    description: 'Learn the basics of Solana program development with hands-on examples and live coding session.',
  },
  holderBenefits: [
    'Private code review sessions with senior developers',
    'Access to exclusive hackathon opportunities',
    'Technical workshops and masterclasses',
    'Founder office hours and mentorship',
    'Grant application guidance and support',
    'Early access to new tools and frameworks',
    'Direct connection with hiring partners',
    'Technical writing and documentation opportunities',
  ],
}

export default function BuilderPreview() {
  return <GuildPreviewTemplate guildData={builderData} />
}
