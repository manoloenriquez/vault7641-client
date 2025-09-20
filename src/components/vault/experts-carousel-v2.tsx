'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

interface Expert {
  id: string
  name: string
  credentials: string[]
  image: string
}

const experts: Expert[] = [
  {
    id: '1',
    name: 'Estudyante Trader',
    credentials: ['Financial Analyst', 'Founder of TET', 'FMVA®'],
    image: '/experts/ET.png',
  },
  {
    id: '2',
    name: 'Giu Comia',
    credentials: ['Web3 Content Creator', 'Speaker & KOL'],
    image: '/experts/Giu.PNG',
  },
  {
    id: '3',
    name: 'BitJom',
    credentials: ['Crypto & Forex Trader'],
    image: '/experts/BitJom.jpg',
  },
  {
    id: '4',
    name: 'Gasul Gaming',
    credentials: ['Web3 Content Creator & Streamer', 'Gamer', 'KOL'],
    image: '/experts/gasul.jpeg',
  },
  {
    id: '5',
    name: 'ChartLizard',
    credentials: ['Financial Planner', 'Full-Time Trader', 'KOL'],
    image: '/experts/chartlizard.jpg',
  },
  {
    id: '6',
    name: 'KoroNFT',
    credentials: ['Web3 Gamer', 'Play2Earn Games', 'KOL'],
    image: '/experts/koro.png',
  },
  {
    id: '7',
    name: 'Zeefreaks',
    credentials: ['Founder of ZFT and Trading Republic'],
    image: '/experts/zeefreaks.png',
  },
  {
    id: '8',
    name: 'Jannidepp',
    credentials: ['Web3 Content Creator', 'KOL'],
    image: '/experts/jannidepp.png',
  },
]

export function ExpertsCarousel() {
  const plugin = Autoplay({ delay: 5000 })

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-sm font-semibold text-yellow-500">OUR EXPERTS</span>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          // plugins={[plugin]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {experts.map((expert) => (
              <CarouselItem key={expert.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="bg-zinc-950/50 border-zinc-800 h-full">
                  <div className="p-4 md:p-6 flex flex-col items-center text-center h-full min-h-[200px] md:min-h-[220px]">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
                      <Image src={expert.image} alt={expert.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-1">{expert.name}</h3>

                      <div className="text-xs md:text-sm font-medium text-zinc-400 line-clamp-3">
                        {expert.credentials.map((credential, index) => (
                          <span key={index}>
                            {credential}
                            {index < expert.credentials.length - 1 ? ' | ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 md:-left-12 h-8 w-8 md:h-10 md:w-10" />
          <CarouselNext className="right-0 md:-right-12 h-8 w-8 md:h-10 md:w-10" />
        </Carousel>
      </div>
    </div>
  )
}
