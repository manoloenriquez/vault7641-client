'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

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
    name: 'Estudyante Trader',
    role: 'Financial Analyst',
    credentials: ['Financial Analyst', 'Founder of TET', 'FMVA®'],
    specialties: ['Financial Analysis', 'Trading', 'Investment Strategy'],
    image: '/experts/ET.png',
  },
  {
    id: '2',
    name: 'Giu Comia',
    role: 'Web3 Content Creator',
    credentials: ['Web3 Content Creator', 'Speaker & KOL'],
    specialties: ['Content Creation', 'Web3 Education', 'Public Speaking'],
    image: '/experts/Giu.PNG',
  },
  {
    id: '3',
    name: 'BitJom',
    role: 'Crypto & Forex Trader',
    credentials: ['Crypto & Forex Trader'],
    specialties: ['Cryptocurrency Trading', 'Forex Trading', 'Market Analysis'],
    image: '/experts/BitJom.jpg',
  },
]

export function ExpertsCarousel() {
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

  const maxIndex = Math.max(0, mockExperts.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-sm font-semibold text-yellow-500">OUR EXPERTS</span>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {mockExperts.map((expert) => (
              <div key={expert.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 flex-shrink-0 px-2">
                <Card className="bg-zinc-950/50 border-zinc-800 p-4 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
                      <Image src={expert.image} alt={expert.name} fill className="object-cover" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-1">{expert.name}</h3>
                      <p className="text-yellow-500 font-medium text-sm mb-2">{expert.role}</p>

                      <div className="space-y-2">
                        <ul className="text-xs text-zinc-400">
                          {expert.credentials.map((credential, index) => (
                            <li key={index}>{credential}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {mockExperts.length > itemsPerView && (
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
