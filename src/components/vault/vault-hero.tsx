'use client'

import { Button } from '@/components/ui/button'
import { useWalletUi } from '@wallet-ui/react'
import { useState, useEffect } from 'react'

export function VaultHero() {
  const { connected, connect } = useWalletUi()
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Mock countdown to mint date - you can replace with actual date
    const mintDate = new Date('2024-12-31T00:00:00Z')

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = mintDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 animate-pulse" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Your crypto homebase.
            <br />
            One pass. Real value.
          </h1>

          {/* Subhead */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A curated Web3 community with unlimited education, opportunities, and fun perks.
          </p>

          {/* Countdown */}
          <div className="flex justify-center mb-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
              <p className="text-sm text-muted-foreground mb-4">Mint starts in</p>
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Priority Access
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/20 hover:border-primary/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              onClick={() => !connected && connect}
            >
              {connected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>

            <Button variant="ghost" size="lg" className="px-8 py-4 text-lg font-semibold rounded-xl hover:bg-accent/10">
              Join Discord
            </Button>
          </div>

          {/* Supply info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              <span className="text-primary font-semibold">7,641</span> Base Passes Available
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
