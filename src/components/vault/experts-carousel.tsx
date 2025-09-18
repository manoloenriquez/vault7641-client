'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useState } from 'react'

interface Expert {
  id: string
  name: string
  role: string
  credentials: string[]
  specialties: string[]
  image: string
}

const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Trading Strategy Lead',
    credentials: ['Former Quantitative Analyst at Goldman Sachs', 'PhD in Financial Mathematics'],
    specialties: ['Technical Analysis', 'Risk Management', 'Algorithmic Trading'],
    image: '/experts/sarah.jpg',
  },
  {
    id: '2',
    name: 'Alex Martinez',
    role: 'Lead Developer & Builder Guild Mentor',
    credentials: ['Core Developer at Solana', '10+ Years Full Stack Experience'],
    specialties: ['Smart Contracts', 'DApp Architecture', 'Security Auditing'],
    image: '/experts/alex.jpg',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Gaming & NFT Specialist',
    credentials: ['Former Product Lead at Axie Infinity', 'Professional Esports Manager'],
    specialties: ['P2E Game Design', 'NFT Valuation', 'Community Building'],
    image: '/experts/mike.jpg',
  },
  {
    id: '4',
    name: 'Lisa Wang',
    role: 'DeFi Strategy Advisor',
    credentials: ['DeFi Protocol Researcher', 'Yield Farming Expert'],
    specialties: ['Yield Optimization', 'Protocol Analysis', 'Risk Assessment'],
    image: '/experts/lisa.jpg',
  },
  {
    id: '5',
    name: 'James Park',
    role: 'Web3 Career Coach',
    credentials: ['Tech Recruiter at ConsenSys', 'Career Development Specialist'],
    specialties: ['Portfolio Review', 'Interview Prep', 'Career Planning'],
    image: '/experts/james.jpg',
  },
]

export function ExpertsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockExperts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mockExperts.length) % mockExperts.length)
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-sm font-semibold text-yellow-500">OUR EXPERTS</span>
        </div>

        <h2 className="text-3xl font-bold mb-8">Learn from Top Crypto Professionals</h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mockExperts.map((expert) => (
              <div key={expert.id} className="w-full flex-shrink-0">
                <Card className="bg-zinc-950/50 border-zinc-800 p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
                      <Image src={expert.image} alt={expert.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{expert.name}</h3>
                      <p className="text-yellow-500 font-medium mb-3">{expert.role}</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Credentials</h4>
                          <div className="space-y-1">
                            {expert.credentials.map((credential, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-sm text-zinc-300">{credential}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {expert.specialties.map((specialty, index) => (
                              <Badge key={index} className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {mockExperts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-yellow-500' : 'bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
