'use client'

import { ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface GuildBenefitsPopoverProps {
  benefits: string[]
}

export function GuildBenefitsPopover({ benefits }: GuildBenefitsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-left text-sm text-white hover:text-zinc-400 flex items-center justify-between relative z-10">
          <span>View Benefit</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-32px)] sm:w-[400px] p-0 bg-zinc-900/95 backdrop-blur relative"
        sideOffset={10}
        align="start"
        avoidCollisions={true}
        collisionPadding={20}
        sticky="always"
      >
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-cyan-500 mt-1">•</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
