'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What is Vault 7641?',
    answer:
      'A curated Web3 community focused on education, real opportunities, and member success. We provide guild-based learning, expert mentorship, and practical tools for your crypto journey.',
  },
  {
    question: 'How do I get on the whitelist?',
    answer:
      'Three paths: Progress WL (earn 60+ points through Discord activities), Community WL (nominated for valuable contributions), or Safety WL (help protect the community from scams).',
  },
  {
    question: 'When is mint?',
    answer:
      'Mint date will be announced 7 days before launch. Whitelist holders get 48h priority access, then public mint opens for remaining spots.',
  },
  {
    question: 'What do holders unlock?',
    answer:
      'Guild access with expert mentors, exclusive educational content, job/bounty board, progress tracking, weekly rewards, and networking opportunities.',
  },
  {
    question: 'Is this financial advice?',
    answer:
      'No. This is a membership collectible for community access. Not investment advice, security, or deposit product. Always DYOR and invest responsibly.',
  },
  {
    question: 'How much does it cost to mint?',
    answer:
      'Pricing will be announced with the mint date. Whitelist holders receive priority access and may get preferential pricing.',
  },
  {
    question: 'What wallets are supported?',
    answer:
      'We support all major Solana wallets including Phantom, Solflare, Backpack, and any wallet-adapter compatible wallet.',
  },
  {
    question: 'Can I change guilds after minting?',
    answer:
      'Guild changes are not currently supported. You have 72 hours after minting to make your initial choice, so choose carefully.',
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
          <p className="text-xl text-zinc-400">
            Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for? Join our Discord for
            real-time support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index)
            return (
              <Card key={index} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                <button
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-zinc-800 pt-4">
                      <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
