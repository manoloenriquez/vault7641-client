'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

interface BenefitsDropdownProps {
  benefits: string[]
}

export function BenefitsDropdown({ benefits }: BenefitsDropdownProps) {
  return (
    <div className="group/benefits flex flex-col relative isolate">
      <button className="w-full text-left text-sm text-cyan-400 hover:text-cyan-300 flex items-center justify-between">
        <span>View Benefits</span>
        <ChevronDown className="w-4 h-4 group-hover/benefits:text-cyan-300" />
      </button>
      <div className="absolute z-[999] opacity-0 pointer-events-none group-hover/benefits:opacity-100 group-hover/benefits:pointer-events-auto top-full left-0 right-0 pt-2 transition-all duration-200">
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardContent className="py-3">
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
