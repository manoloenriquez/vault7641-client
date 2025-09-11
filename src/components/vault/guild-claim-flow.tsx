'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWalletUi } from '@wallet-ui/react'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Coins, Gamepad2, Code, Briefcase } from 'lucide-react'

const guilds = [
  {
    id: 'trader',
    name: 'Trader/HODLers',
    description: 'For those who live and breathe market movements',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    rarity: 'Common',
  },
  {
    id: 'defi',
    name: 'DeFi & Airdrops',
    description: 'Masters of yield farming and airdrop hunting',
    icon: Coins,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    rarity: 'Uncommon',
  },
  {
    id: 'nft-gaming',
    name: 'NFTs & Gaming',
    description: 'Digital collectors and Web3 gaming enthusiasts',
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    rarity: 'Rare',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Builders shaping the future of Web3',
    icon: Code,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    rarity: 'Legendary',
  },
  {
    id: 'careers',
    name: 'Careers',
    description: 'Professionals building Web3 careers',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    rarity: 'Uncommon',
  },
]

type ClaimStep = 'connect' | 'detect' | 'choose' | 'confirm' | 'claim' | 'complete'

export function GuildClaimFlow() {
  const { connected, account } = useWalletUi()
  const [currentStep, setCurrentStep] = useState<ClaimStep>('connect')
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60) // 72 hours in seconds
  const [hasBasePasses, setHasBasePasses] = useState(false)

  // Suppress unused variable warning
  void hasBasePasses

  // Mock data - replace with real NFT detection
  useEffect(() => {
    if (connected && account?.publicKey) {
      setCurrentStep('detect')
      // Simulate NFT detection
      setTimeout(() => {
        setHasBasePasses(true)
        setCurrentStep('choose')
      }, 2000)
    } else {
      setCurrentStep('connect')
    }
  }, [connected, account?.publicKey])

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const handleGuildSelect = (guildId: string) => {
    setSelectedGuild(guildId)
  }

  const handleConfirmSelection = () => {
    if (selectedGuild) {
      setCurrentStep('confirm')
    }
  }

  const handleClaim = async () => {
    setCurrentStep('claim')
    // Simulate claim transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setCurrentStep('complete')
  }

  const selectedGuildData = guilds.find((g) => g.id === selectedGuild)

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Claim Your Guild</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Complete your Base Pass by selecting your specialized guild and claiming your PFP.
            </p>

            {/* Time Remaining */}
            {timeRemaining > 0 && currentStep !== 'complete' && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 inline-block">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Time remaining to choose: </span>
                  <span className="font-bold text-primary">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[
                { step: 'connect', label: 'Connect', icon: '1' },
                { step: 'detect', label: 'Detect Pass', icon: '2' },
                { step: 'choose', label: 'Choose Guild', icon: '3' },
                { step: 'confirm', label: 'Confirm', icon: '4' },
                { step: 'complete', label: 'Complete', icon: '✓' },
              ].map((item, index) => {
                const isActive = currentStep === item.step
                const isCompleted =
                  ['connect', 'detect', 'choose', 'confirm'].includes(item.step) &&
                  ['confirm', 'claim', 'complete'].includes(currentStep)

                return (
                  <div key={item.step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`ml-2 text-sm ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                    >
                      {item.label}
                    </span>
                    {index < 4 && <div className="w-8 h-0.5 bg-border mx-4" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            {/* Step 1: Connect Wallet */}
            {currentStep === 'connect' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  Connect the wallet containing your Base Pass to begin the guild selection process.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Connect Wallet
                </Button>
              </div>
            )}

            {/* Step 2: Detecting Base Pass */}
            {currentStep === 'detect' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Detecting Base Pass</h2>
                <p className="text-muted-foreground mb-6">Scanning your wallet for Base Pass NFTs...</p>
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4" />
                </div>
              </div>
            )}

            {/* Step 3: Choose Guild */}
            {currentStep === 'choose' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Guild</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {guilds.map((guild) => (
                    <div
                      key={guild.id}
                      onClick={() => handleGuildSelect(guild.id)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:scale-105 ${
                        selectedGuild === guild.id
                          ? `${guild.borderColor} bg-gradient-to-br ${guild.bgColor}`
                          : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 ${guild.bgColor} rounded-xl flex items-center justify-center border ${guild.borderColor}`}
                        >
                          <guild.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm">{guild.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {guild.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{guild.description}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleConfirmSelection}
                    disabled={!selectedGuild}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Confirm Guild Selection
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm Selection */}
            {currentStep === 'confirm' && selectedGuildData && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">Confirm Your Choice</h2>
                <div className="bg-card border border-border/50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                  <div
                    className={`w-16 h-16 ${selectedGuildData.bgColor} rounded-xl flex items-center justify-center border ${selectedGuildData.borderColor} mx-auto mb-4`}
                  >
                    <selectedGuildData.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{selectedGuildData.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedGuildData.description}</p>
                  <Badge className="mb-4">{selectedGuildData.rarity}</Badge>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 mb-6 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-500" />
                  <strong>Important:</strong> This choice is permanent and cannot be changed later.
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep('choose')}>
                    Go Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleClaim}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Claim Guild & PFP
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Claiming */}
            {currentStep === 'claim' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Claiming Your Guild</h2>
                <p className="text-muted-foreground mb-6">Processing your guild selection and generating your PFP...</p>
                <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />
              </div>
            )}

            {/* Step 6: Complete */}
            {currentStep === 'complete' && selectedGuildData && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Welcome to {selectedGuildData.name}!</h2>
                <p className="text-muted-foreground mb-6">
                  Your guild membership has been confirmed and your PFP has been generated.
                </p>

                <div className="bg-card border border-border/50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <selectedGuildData.icon className="w-12 h-12" />
                  </div>
                  <h3 className="font-bold mb-2">Your New PFP</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGuildData.rarity} • {selectedGuildData.name}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    View Profile
                  </Button>
                  <Button variant="outline" size="lg">
                    Join Guild Discord
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
