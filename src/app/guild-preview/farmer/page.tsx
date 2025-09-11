'use client'

import { GuildPreviewTemplate } from '@/components/vault/guild-preview-template'
import { Coins } from 'lucide-react'

const farmerData = {
  id: 'farmer',
  name: 'Farmer',
  description: 'DeFi users and airdrop farmers who run systems safely',
  whoItIsFor:
    'For DeFi users and airdrop farmers who run systems safely and consistently. Always bridging, staking/restaking, LPs, quests, and running testnets with checklists, trackers, and tons of risk control.',
  icon: Coins,
  color: 'from-blue-500 to-cyan-600',
  bgColor: 'bg-blue-500/10',
  borderColor: 'border-blue-500/20',
  weeklyActivities: ['Airdrop Farming Updates', 'DeFi Protocol Reviews', 'Yield Optimization Sessions'],
  foundingQuests: [
    {
      title: 'Multi-Protocol Farming Challenge',
      description: 'Set up yield farming positions across 3 different protocols with documented risk analysis',
      reward: '+25 WL Points',
      difficulty: 'Advanced',
      timeEstimate: '2-4 hours',
    },
    {
      title: 'Testnet Hunter Mission',
      description: 'Complete testnet activities for 2 upcoming protocols and document your experience',
      reward: '+20 WL Points',
      difficulty: 'Intermediate',
      timeEstimate: '3-5 hours',
    },
  ],
  nextClass: {
    title: 'Advanced DeFi Strategies: Multi-Chain Yield Farming',
    date: '2024-12-28',
    time: '15:00',
    instructor: 'Sarah Kim',
    description:
      'Learn advanced yield farming techniques across multiple chains with risk management and automation strategies.',
  },
  holderBenefits: [
    'Exclusive airdrop intelligence and early alerts',
    'Advanced yield farming strategies and tools',
    'Protocol deep dives with risk assessments',
    'Automation scripts and farming bots',
    'Risk management frameworks and checklists',
    'Direct access to protocol founders',
    'Priority access to new farming opportunities',
    'Insurance and risk mitigation guidance',
  ],
}

export default function FarmerPreview() {
  return <GuildPreviewTemplate guildData={farmerData} />
}
