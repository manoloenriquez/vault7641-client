'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Partner {
  id: string
  name: string
  logo: string
  description: string
}

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'CryptoTech Solutions',
    logo: '/partners/cryptotech.png',
    description: 'Leading blockchain development and consulting firm',
  },
  {
    id: '2',
    name: 'DeFi Ventures',
    logo: '/partners/defi-ventures.png',
    description: 'Strategic investment and incubation platform for DeFi projects',
  },
  {
    id: '3',
    name: 'GameFi Alliance',
    logo: '/partners/gamefi-alliance.png',
    description: 'Premier P2E gaming guild and NFT collective',
  },
  {
    id: '4',
    name: 'Web3 Academy',
    logo: '/partners/web3-academy.png',
    description: 'Educational platform for blockchain and cryptocurrency',
  },
  {
    id: '5',
    name: 'Secure Chain',
    logo: '/partners/secure-chain.png',
    description: 'Blockchain security and smart contract audit firm',
  },
]

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockPartners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mockPartners.length) % mockPartners.length)
  }

  return (
    <div className="relative py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm font-semibold text-blue-500">OUR PARTNERS</span>
        </div>

        <h2 className="text-3xl font-bold mb-8">Trusted by Industry Leaders</h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mockPartners.map((partner) => (
              <div key={partner.id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-zinc-950/50 border-zinc-800 p-8">
                  <div className="text-center">
                    <div className="relative w-48 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl" />
                      <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                    <p className="text-zinc-400">{partner.description}</p>
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
            {mockPartners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-blue-500' : 'bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
