'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Partner {
  id: string
  name: string
  logo: string
  description: string
}

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'DeFi Protocol',
    logo: '/partners/defi-protocol.png',
    description: 'Leading decentralized finance protocol',
  },
  {
    id: '2',
    name: 'NFT Marketplace',
    logo: '/partners/nft-marketplace.png',
    description: 'Premier NFT trading platform',
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
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width >= 1536) setItemsPerView(5)
      else if (width >= 1280) setItemsPerView(4)
      else if (width >= 1024) setItemsPerView(3)
      else if (width >= 768) setItemsPerView(2)
      else setItemsPerView(1)
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, mockPartners.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm font-semibold text-blue-500">OUR PARTNERS</span>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {mockPartners.map((partner) => (
              <div key={partner.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 flex-shrink-0 px-2">
                <Card className="bg-zinc-950/50 border-zinc-800 p-4 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl" />
                      <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                    </div>

                    <h3 className="text-lg font-bold mb-1">{partner.name}</h3>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {mockPartners.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950/80 border border-zinc-800 -ml-5 transform hover:scale-110 transition-transform ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-950/80 border border-zinc-800 -mr-5 transform hover:scale-110 transition-transform ${
                  currentIndex === maxIndex ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentIndex === maxIndex}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
