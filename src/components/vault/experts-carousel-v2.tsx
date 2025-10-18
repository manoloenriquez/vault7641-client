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
    name: 'BitMaestro',
    credentials: ['Founder of PCP', 'Full-Time Trader', 'KOL'],
    image: '/experts/bitmaestro.png',
  },
  {
    id: '2',
    name: 'Giu Comia',
    credentials: ['Web3 Content Creator', 'Speaker & KOL'],
    image: '/experts/Giu.PNG',
  },
  {
    id: '3',
    name: 'KoroNFT',
    credentials: ['Web3 Gamer', 'Play2Earn Games', 'KOL'],
    image: '/experts/koro.png',
  },
  {
    id: '5',
    name: 'John F Dong',
    credentials: ['KOL', 'Content Strategist at Web3TV', 'Anichess Ambassador'],
    image: '/experts/john-f-dong.png',
  },
  {
    id: '6',
    name: 'Panzel Garcia',
    credentials: ['Web3 & P2E Content Creator'],
    image: '/experts/panzel-garcia.png',
  },
  {
    id: '7',
    name: 'Zeefreaks',
    credentials: ['Founder of ZFT and Trading Republic'],
    image: '/experts/zeefreaks.png',
  },
  {
    id: '8',
    name: 'Estudyante Trader',
    credentials: ['Financial Analyst', 'Founder of TET', 'FMVA®'],
    image: '/experts/ET.png',
  },
  {
    id: '9',
    name: 'Master Kamote',
    credentials: ['Ronin Creator', 'Star Atlas Ambassador', 'YGG Guild Alliance Leader'],
    image: '/experts/master-kamote.png',
  },
  {
    id: '11',
    name: 'Aaron Reyes',
    credentials: ['KOL', 'Full-Time Trader & Investor'],
    image: '/experts/aaron-reyes.png',
  },
  {
    id: '12',
    name: 'Cryptita',
    credentials: ['Educator', 'Community Founder'],
    image: '/experts/cryptita.png',
  },
  {
    id: '13',
    name: 'BitJom',
    credentials: ['Crypto & Forex Trader'],
    image: '/experts/BitJom.jpg',
  },
  {
    id: '14',
    name: 'GasulGaming',
    credentials: ['Web3 Content Creator & Streamer', 'Gamer', 'KOL'],
    image: '/experts/gasul.jpeg',
  },
  {
    id: '15',
    name: 'ChartLizard',
    credentials: ['Financial Planner', 'Full-Time Trader', 'KOL'],
    image: '/experts/chartlizard.jpg',
  },
  {
    id: '16',
    name: 'Hari',
    credentials: ['Airdrop Hunter', 'Founder of HariDrops Community'],
    image: '/experts/hari.png',
  },
  {
    id: '17',
    name: 'Jannidepp',
    credentials: ['Web3 Content Creator', 'KOL'],
    image: '/experts/jannidepp.png',
  },
  {
    id: '18',
    name: '0xmulli',
    credentials: ['Web3 Developer'],
    image: '/experts/0xmulli.JPG',
  },
  {
    id: '19',
    name: 'Chartiq',
    credentials: ['NFT & DAO Contributor', 'Community & Collabs Strategist'],
    image: '/experts/chartiq.png',
  },
  {
    id: '20',
    name: 'Bryan Mesia',
    credentials: ['KOL', 'P2E Content Creator'],
    image: '/experts/bryan-mesia.png',
  },
  {
    id: '21',
    name: "Gab's Crypto",
    credentials: ['Business Analyst Professional', '2017 Crypto Investor and Trader', "Founder of Gab's Crypto PH"],
    image: '/experts/gabs-crypto.png',
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
                      <h3 className="text-white md:text-lg font-bold mb-2 line-clamp-1">{expert.name}</h3>

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
