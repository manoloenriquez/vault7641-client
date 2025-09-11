'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MessageCircle, Book, Wallet, Zap, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

const supportCategories = [
  {
    id: 'wallet',
    title: 'Wallet & Connection',
    icon: Wallet,
    color: 'bg-blue-500/20 text-blue-400',
    articles: [
      {
        title: 'How to connect your Solana wallet',
        description: 'Step-by-step guide for connecting Phantom, Solflare, and other wallets',
        difficulty: 'Beginner',
        readTime: '2 min',
      },
      {
        title: 'Wallet connection troubleshooting',
        description: 'Common issues and solutions for wallet connectivity problems',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'Switching between Solana networks',
        description: 'How to change between Mainnet, Devnet, and Testnet',
        difficulty: 'Intermediate',
        readTime: '2 min',
      },
      {
        title: 'Wallet security best practices',
        description: 'Keep your wallet and funds secure with these essential tips',
        difficulty: 'Beginner',
        readTime: '5 min',
      },
    ],
  },
  {
    id: 'minting',
    title: 'Minting & NFTs',
    icon: Zap,
    color: 'bg-purple-500/20 text-purple-400',
    articles: [
      {
        title: 'How to mint your Base Pass',
        description: 'Complete guide to minting your Vault 7641 Base Pass NFT',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'Mint failed - what to do?',
        description: 'Troubleshooting failed transactions and getting refunds',
        difficulty: 'Intermediate',
        readTime: '4 min',
      },
      {
        title: 'Guild selection and PFP claiming',
        description: 'How to choose your guild and claim your profile picture',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'Understanding transaction fees',
        description: 'Why fees exist and how to optimize your transaction costs',
        difficulty: 'Intermediate',
        readTime: '3 min',
      },
    ],
  },
  {
    id: 'community',
    title: 'Community & Discord',
    icon: MessageCircle,
    color: 'bg-green-500/20 text-green-400',
    articles: [
      {
        title: 'Joining the Discord server',
        description: 'How to join and get verified in our Discord community',
        difficulty: 'Beginner',
        readTime: '2 min',
      },
      {
        title: 'Discord verification process',
        description: 'Link your wallet to Discord for member benefits',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'Guild channels and permissions',
        description: 'Understanding guild-specific channels and access levels',
        difficulty: 'Beginner',
        readTime: '2 min',
      },
      {
        title: 'Community guidelines and rules',
        description: 'Our community standards and what we expect from members',
        difficulty: 'Beginner',
        readTime: '4 min',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Questions',
    icon: Book,
    color: 'bg-orange-500/20 text-orange-400',
    articles: [
      {
        title: 'What is Vault 7641?',
        description: 'Overview of our community, mission, and what we offer',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'How guilds work',
        description: 'Understanding the guild system and choosing the right one',
        difficulty: 'Beginner',
        readTime: '4 min',
      },
      {
        title: 'Membership benefits explained',
        description: 'Complete list of what you get as a Vault 7641 member',
        difficulty: 'Beginner',
        readTime: '3 min',
      },
      {
        title: 'Refund and cancellation policy',
        description: 'Important information about our no-refund policy',
        difficulty: 'Beginner',
        readTime: '2 min',
      },
    ],
  },
]

const quickActions = [
  {
    title: 'Join Discord Support',
    description: 'Get help from our community team in real-time',
    action: 'Join Now',
    icon: MessageCircle,
    color: 'bg-gradient-to-r from-primary to-accent',
  },
  {
    title: 'Check System Status',
    description: 'View current status of our systems and services',
    action: 'View Status',
    icon: CheckCircle,
    color: 'bg-green-600',
  },
  {
    title: 'Submit Bug Report',
    description: 'Report technical issues or bugs you&apos;ve encountered',
    action: 'Report Bug',
    icon: AlertCircle,
    color: 'bg-orange-600',
  },
]

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400',
  Intermediate: 'bg-yellow-500/20 text-yellow-400',
  Advanced: 'bg-red-500/20 text-red-400',
}

export function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = supportCategories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.articles.length > 0 || searchTerm === '')

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Support Center</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Find answers to common questions, get help with technical issues, and connect with our support team for
              personalized assistance.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-12 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles, guides, and solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-base bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">{action.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4">{action.description}</p>
                <Button size="sm" className="w-full">
                  {action.action}
                  <ExternalLink className="ml-2 w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All Categories
              </Button>
              {supportCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.title}
                </Button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="space-y-12">
              {filteredCategories
                .filter((category) => selectedCategory === null || category.id === selectedCategory)
                .map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold">{category.title}</h3>
                      <Badge variant="outline">{category.articles.length} articles</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-lg pr-4">{article.title}</h4>
                            <Badge className={difficultyColors[article.difficulty as keyof typeof difficultyColors]}>
                              {article.difficulty}
                            </Badge>
                          </div>

                          <p className="text-zinc-400 mb-4 leading-relaxed">{article.description}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">{article.readTime} read</span>
                            <Button size="sm" variant="ghost">
                              Read Article →
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help. Join our Discord for
              real-time assistance or submit a support ticket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Join Discord Support
                <MessageCircle className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Submit Support Ticket
              </Button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 text-center">
            <div className="bg-card/30 border border-border/50 rounded-xl p-4">
              <p className="text-sm text-zinc-400">
                <strong>Emergency Issues:</strong> For urgent security concerns or critical bugs, contact our team
                immediately at{' '}
                <a href="mailto:security@vault7641.com" className="text-primary hover:underline">
                  security@vault7641.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
