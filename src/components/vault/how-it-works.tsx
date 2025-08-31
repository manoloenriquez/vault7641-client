'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Wallet, Shield, Users } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Mint your Base Pass',
    description: 'Connect your wallet and mint your Base Pass NFT to gain entry to Vault 7641.',
    icon: Wallet,
    details: 'One-time mint gives you access to all guild benefits and community features.',
  },
  {
    number: 2,
    title: 'Choose your Guild',
    description: 'Select from 5 specialized guilds based on your interests and expertise.',
    icon: Shield,
    details: '72h window to choose: Trader, DeFi & Airdrops, NFTs & Gaming, Developer, or Careers.',
  },
  {
    number: 3,
    title: 'Verify & Start Quests',
    description: 'Join Discord, verify your membership, and begin earning XP through quests.',
    icon: Users,
    details: 'Unlock exclusive channels, participate in competitions, and climb the leaderboard.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to join the most active Web3 community and unlock your potential.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
                )}

                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Step Icon & Number */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/20">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{step.description}</p>
                    <p className="text-sm text-muted-foreground mb-6">{step.details}</p>

                    {/* Micro FAQ Link */}
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                      Learn more about this step
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of members already building their Web3 future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Mint Your Pass
                </Button>
                <Button variant="outline" size="lg">
                  Join Discord First
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
