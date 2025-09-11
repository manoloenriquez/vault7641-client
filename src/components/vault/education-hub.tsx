'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, BookOpen, FileText, Clock, Users, Star } from 'lucide-react'

const playlists = [
  {
    id: 'solana-basics',
    title: 'Solana Fundamentals',
    description: 'Master the basics of Solana blockchain and ecosystem',
    videos: 12,
    duration: '2h 30m',
    level: 'Beginner',
    thumbnail: '/thumbnails/solana-basics.jpg',
    instructor: 'Alex Chen',
    rating: 4.9,
    guild: 'All Guilds',
  },
  {
    id: 'defi-strategies',
    title: 'Advanced DeFi Strategies',
    description: 'Learn yield farming, liquidity provision, and risk management',
    videos: 18,
    duration: '4h 15m',
    level: 'Advanced',
    thumbnail: '/thumbnails/defi-strategies.jpg',
    instructor: 'Sarah Kim',
    rating: 4.8,
    guild: 'DeFi & Airdrops',
  },
  {
    id: 'nft-analysis',
    title: 'NFT Market Analysis',
    description: 'Tools and techniques for evaluating NFT projects',
    videos: 8,
    duration: '1h 45m',
    level: 'Intermediate',
    thumbnail: '/thumbnails/nft-analysis.jpg',
    instructor: 'Marcus Rodriguez',
    rating: 4.7,
    guild: 'NFTs & Gaming',
  },
  {
    id: 'smart-contracts',
    title: 'Solana Smart Contract Development',
    description: 'Build and deploy programs on Solana using Rust',
    videos: 25,
    duration: '6h 30m',
    level: 'Advanced',
    thumbnail: '/thumbnails/smart-contracts.jpg',
    instructor: 'David Park',
    rating: 4.9,
    guild: 'Developer',
  },
]

const starterPacks = [
  {
    title: 'New to Crypto',
    description: 'Essential knowledge for crypto beginners',
    items: ['Wallet Setup Guide', 'Security Best Practices', 'Basic Trading', 'DeFi Introduction'],
    duration: '30 min',
    difficulty: 'Beginner',
    icon: BookOpen,
  },
  {
    title: 'Solana Ecosystem',
    description: 'Navigate the Solana blockchain ecosystem',
    items: ['Network Overview', 'Key Projects', 'Wallet Integration', 'Transaction Basics'],
    duration: '45 min',
    difficulty: 'Beginner',
    icon: PlayCircle,
  },
  {
    title: 'Guild Specialization',
    description: 'Deep dive into your chosen guild focus',
    items: ['Guild-Specific Tools', 'Advanced Strategies', 'Community Resources', 'Expert Tips'],
    duration: '60 min',
    difficulty: 'Intermediate',
    icon: Users,
  },
]

const reports = [
  {
    title: 'Q4 2024 Solana Ecosystem Report',
    description: "Comprehensive analysis of Solana's growth, key metrics, and emerging trends",
    date: '2024-12-01',
    type: 'Market Analysis',
    pages: 45,
    downloads: 2847,
    featured: true,
  },
  {
    title: 'DeFi Yield Opportunities December 2024',
    description: 'Current yield farming opportunities with risk assessments',
    date: '2024-12-15',
    type: 'DeFi Research',
    pages: 28,
    downloads: 1923,
    featured: false,
  },
  {
    title: 'NFT Market Trends & Predictions',
    description: 'Analysis of NFT market cycles and upcoming project evaluations',
    date: '2024-12-10',
    type: 'NFT Analysis',
    pages: 32,
    downloads: 1654,
    featured: false,
  },
]

const levelColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function EducationHub() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Education Hub</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Accelerate your Web3 journey with curated content, expert insights, and guild-specific learning paths
              designed by industry professionals.
            </p>
          </div>

          {/* Video Playlists */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Video Playlists</h2>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                View All Playlists
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                    <div className="absolute top-4 right-4">
                      <Badge className={levelColors[playlist.level as keyof typeof levelColors] || 'bg-muted'}>
                        {playlist.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white text-sm">
                      {playlist.videos} videos • {playlist.duration}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{playlist.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {playlist.rating}
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 mb-4">{playlist.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-zinc-400">by {playlist.instructor}</div>
                      <Badge variant="outline" className="text-xs">
                        {playlist.guild}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Starter Packs */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Starter Packs</h2>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Browse All Packs
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {starterPacks.map((pack, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <pack.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{pack.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Clock className="w-3 h-3" />
                        {pack.duration}
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {pack.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 mb-4">{pack.description}</p>

                  <div className="space-y-2 mb-6">
                    {pack.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">Start Learning</Button>
                </div>
              ))}
            </div>
          </section>

          {/* Research Reports */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Research Reports</h2>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                View Archive
              </Button>
            </div>

            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 ${report.featured ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{report.title}</h3>
                        {report.featured && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">Featured</Badge>
                        )}
                      </div>

                      <p className="text-zinc-400 mb-4">{report.description}</p>

                      <div className="flex items-center gap-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {report.pages} pages
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {report.downloads.toLocaleString()} downloads
                        </div>
                        <div>{new Date(report.date).toLocaleDateString()}</div>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Button size="sm">Download PDF</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Level Up?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Join Vault 7641 to access exclusive educational content, connect with experts, and accelerate your Web3
              learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Join Community
              </Button>
              <Button variant="outline" size="lg">
                Browse Free Content
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
