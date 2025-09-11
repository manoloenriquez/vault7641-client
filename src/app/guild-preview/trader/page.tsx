'use client'

import { GuildPreviewTemplate } from '@/components/vault/guild-preview-template'
import { TrendingUp } from 'lucide-react'

const traderData = {
  id: 'trader',
  name: 'Trader',
  description: 'Process-first traders and long-term holders',
  whoItIsFor:
    'For traders and long-term holders who care about strategy, risk, and finding only the best opportunities.',
  icon: TrendingUp,
  color: 'from-green-500 to-emerald-600',
  bgColor: 'bg-green-500/10',
  borderColor: 'border-green-500/20',
  weeklyActivities: ['Daily Market Analysis', 'Risk Management Workshop', 'Portfolio Review Sessions'],
  foundingQuests: [
    {
      title: 'Market Analysis Challenge',
      description: 'Analyze a trending token and present your findings with technical analysis and risk assessment',
      reward: '+20 WL Points',
      difficulty: 'Intermediate',
      timeEstimate: '1-2 hours',
    },
    {
      title: 'Paper Trading Competition',
      description: 'Complete a 7-day paper trading challenge with documented strategy and results',
      reward: '+30 WL Points',
      difficulty: 'Advanced',
      timeEstimate: '7 days',
    },
  ],
  nextClass: {
    title: 'Advanced Technical Analysis in Crypto Markets',
    date: '2024-12-30',
    time: '19:00',
    instructor: 'Alex Chen',
    description: 'Master advanced TA techniques specifically for crypto markets with live chart analysis and Q&A.',
  },
  holderBenefits: [
    'Real-time market signals and alerts',
    'Private trading strategy sessions',
    'Risk management tools and calculators',
    'Portfolio optimization guidance',
    'Direct access to trading mentors',
    'Exclusive market research reports',
    'Early access to new trading opportunities',
    'Priority support for trading questions',
  ],
}

export default function TraderPreview() {
  return <GuildPreviewTemplate guildData={traderData} />
}
