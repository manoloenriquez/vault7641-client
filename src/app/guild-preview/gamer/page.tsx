'use client'

import { GuildPreviewTemplate } from '@/components/vault/guild-preview-template'
import { Gamepad2 } from 'lucide-react'

const gamerData = {
  id: 'gamer',
  name: 'Gamer',
  description: 'Competitive P2E players and NFT collectors',
  whoItIsFor: 'For competitive P2E players and NFT collectors who break games, analyze metas, and curate collections.',
  icon: Gamepad2,
  color: 'from-purple-500 to-pink-600',
  bgColor: 'bg-purple-500/10',
  borderColor: 'border-purple-500/20',
  weeklyActivities: ['P2E Game Analysis', 'NFT Market Reviews', 'Gaming Tournaments'],
  foundingQuests: [
    {
      title: 'NFT Collection Analysis',
      description: 'Research and analyze an upcoming NFT project using our evaluation framework and present findings',
      reward: '+20 WL Points',
      difficulty: 'Intermediate',
      timeEstimate: '1-2 hours',
    },
    {
      title: 'P2E Game Beta Test',
      description: 'Play and review a new P2E game, documenting gameplay mechanics and earning potential',
      reward: '+25 WL Points',
      difficulty: 'Beginner',
      timeEstimate: '2-3 hours',
    },
  ],
  nextClass: {
    title: 'NFT Investment Strategies: Rarity and Market Analysis',
    date: '2024-12-31',
    time: '18:00',
    instructor: 'Marcus Rodriguez',
    description:
      'Learn how to evaluate NFT projects, understand rarity mechanics, and identify valuable collections before they pump.',
  },
  holderBenefits: [
    'NFT alpha and exclusive mint lists',
    'Gaming guild partnerships and tournaments',
    'Metaverse land investment opportunities',
    'P2E strategy guides and earning optimization',
    'Collection analytics and rarity tools',
    'Direct access to game developers',
    'Priority access to new game launches',
    'NFT trading signals and market analysis',
  ],
}

export default function GamerPreview() {
  return <GuildPreviewTemplate guildData={gamerData} />
}
