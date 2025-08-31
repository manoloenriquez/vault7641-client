'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const faqs = [
  {
    category: 'Mint Mechanics',
    questions: [
      {
        question: 'How much does it cost to mint a Base Pass?',
        answer:
          'Base Pass costs 0.5 SOL during the priority access phase and 0.6 SOL during public mint, plus Solana network fees.',
      },
      {
        question: 'How many Base Passes can I mint?',
        answer:
          'Priority access holders can mint up to 2 passes per wallet. Public mint is limited to 1 pass per wallet.',
      },
      {
        question: 'What wallets are supported?',
        answer:
          'We support all major Solana wallets including Phantom, Solflare, Backpack, and any wallet-adapter compatible wallet.',
      },
      {
        question: 'What happens if the mint fails?',
        answer:
          'Failed transactions are automatically refunded. Our system includes retry logic and fee estimation to minimize failures.',
      },
    ],
  },
  {
    category: 'Guild System',
    questions: [
      {
        question: 'How long do I have to choose my guild?',
        answer:
          "You have 72 hours after minting to select your guild. After this window, you'll be assigned to a guild based on your wallet activity.",
      },
      {
        question: 'Can I change guilds later?',
        answer:
          'Guild changes are not currently supported. Choose carefully as this determines your specialized content and community.',
      },
      {
        question: "What if I don't fit into any guild?",
        answer:
          'Every member finds value in at least one guild. Our onboarding quiz helps match you to the best fit based on your interests and goals.',
      },
    ],
  },
  {
    category: 'Membership & Benefits',
    questions: [
      {
        question: 'What do I get immediately after minting?',
        answer:
          'Immediate access to Discord verification, basic community channels, and guild selection. Full benefits unlock within 48 hours of verification.',
      },
      {
        question: 'Are there recurring fees?',
        answer:
          'No recurring fees. Your Base Pass provides lifetime access to Season 1 benefits. Future seasons may require separate passes.',
      },
      {
        question: 'Can I resell my Base Pass?',
        answer:
          'Yes, Base Passes are tradeable NFTs. However, guild selection and XP progress are tied to the original minting wallet.',
      },
    ],
  },
  {
    category: 'Technical Support',
    questions: [
      {
        question: 'What if I have trouble connecting my wallet?',
        answer:
          "Try refreshing the page, checking your wallet is unlocked, and ensuring you're on the correct network. Our support bot can help troubleshoot specific issues.",
      },
      {
        question: 'Is there a refund policy?',
        answer:
          "All sales are final. NFTs are non-refundable digital collectibles. Please make sure you understand what you're purchasing.",
      },
      {
        question: 'How do I get help if something goes wrong?',
        answer:
          'Use the "Having trouble?" modal on any page, join our Discord support channel, or contact our team directly through the support page.',
      },
    ],
  },
]

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers. Can't find what you're looking for? Join our Discord for real-time
              support.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-12">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-base"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xl font-bold mb-4 text-primary">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const itemId = `${categoryIndex}-${faqIndex}`
                    const isOpen = openItems.has(itemId)

                    return (
                      <div
                        key={faqIndex}
                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden"
                      >
                        <button
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                          onClick={() => toggleItem(itemId)}
                        >
                          <span className="font-semibold pr-4">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="border-t border-border/50 pt-4">
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No FAQs found matching "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </div>
          )}

          {/* Support CTA */}
          <div className="mt-16 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our community and support team are here to help you succeed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Join Discord Support
              </Button>
              <Button variant="outline" size="lg">
                Contact Support Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
