'use client'

import { Button } from '@/components/ui/button'
import { useWalletUi } from '@wallet-ui/react'
import { useState } from 'react'
import { Minus, Plus, Loader2 } from 'lucide-react'

type MintPhase = 'countdown' | 'whitelist' | 'public' | 'paused' | 'sold-out'
type MintState =
  | 'idle'
  | 'connecting'
  | 'wrong-network'
  | 'not-eligible'
  | 'cap-reached'
  | 'pending'
  | 'success'
  | 'error'

export function MintModule() {
  const { connected } = useWalletUi()
  const [mintAmount, setMintAmount] = useState(1)
  const [mintState, setMintState] = useState<MintState>('idle')
  const [mintPhase] = useState<MintPhase>('countdown') // This would come from your mint logic

  // Mock data - replace with real data from your candy machine
  const mintData = {
    price: 0.5, // SOL
    maxPerWallet: 2,
    supply: 7641,
    minted: 1250,
    userMinted: 0,
  }

  const remaining = mintData.supply - mintData.minted
  const progress = (mintData.minted / mintData.supply) * 100

  const handleMint = async () => {
    if (!connected) return

    setMintState('pending')

    // Mock mint logic - replace with actual Solana mint transaction
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate transaction
      setMintState('success')
      setTimeout(() => setMintState('idle'), 3000)
    } catch (error) {
      console.error('Mint failed:', error)
      setMintState('error')
      setTimeout(() => setMintState('idle'), 3000)
    }
  }

  const canIncrease = mintAmount < mintData.maxPerWallet && mintAmount < remaining
  const canDecrease = mintAmount > 1

  const getPhaseDisplay = () => {
    switch (mintPhase) {
      case 'countdown':
        return { text: 'Coming Soon', color: 'bg-muted text-muted-foreground' }
      case 'whitelist':
        return { text: 'Priority Access', color: 'bg-primary text-primary-foreground' }
      case 'public':
        return { text: 'Public Mint', color: 'bg-green-600 text-white' }
      case 'paused':
        return { text: 'Paused', color: 'bg-yellow-600 text-white' }
      case 'sold-out':
        return { text: 'Sold Out', color: 'bg-red-600 text-white' }
    }
  }

  const getMintButtonText = () => {
    if (!connected) return 'Connect Wallet'
    if (mintState === 'pending') return 'Minting...'
    if (mintState === 'success') return 'Minted! ✨'
    if (mintState === 'error') return 'Mint Failed - Retry'
    if (mintPhase === 'countdown') return 'Mint Not Started'
    if (mintPhase === 'sold-out') return 'Sold Out'
    return `Mint ${mintAmount} for ${(mintData.price * mintAmount).toFixed(2)} SOL`
  }

  const isMintDisabled = () => {
    return (
      !connected || mintPhase === 'countdown' || mintPhase === 'sold-out' || mintState === 'pending' || remaining === 0
    )
  }

  const phaseDisplay = getPhaseDisplay()

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Mint Card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-2xl sticky top-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Base Pass — S1</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${phaseDisplay.color}`}>
                  {phaseDisplay.text}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Supply: {mintData.supply.toLocaleString()}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Minted: {mintData.minted.toLocaleString()}</span>
                <span>Remaining: {remaining.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Mint Controls */}
            <div className="space-y-4">
              {/* Amount Selector */}
              <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => canDecrease && setMintAmount((prev) => prev - 1)}
                  disabled={!canDecrease}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="text-center">
                  <div className="text-2xl font-bold">{mintAmount}</div>
                  <div className="text-xs text-muted-foreground">Max {mintData.maxPerWallet} per wallet</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => canIncrease && setMintAmount((prev) => prev + 1)}
                  disabled={!canIncrease}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price Display */}
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Price</div>
                <div className="text-2xl font-bold">{(mintData.price * mintAmount).toFixed(2)} SOL</div>
                <div className="text-xs text-muted-foreground">+ network fees</div>
              </div>

              {/* Mint Button */}
              <Button
                className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted disabled:to-muted"
                onClick={handleMint}
                disabled={isMintDisabled()}
              >
                {mintState === 'pending' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getMintButtonText()}
              </Button>

              {/* Quick Actions */}
              {connected && mintPhase !== 'countdown' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setMintAmount(Math.min(mintData.maxPerWallet, remaining))}
                    disabled={remaining === 0}
                  >
                    Max
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setMintAmount(1)}>
                    Reset
                  </Button>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {mintState === 'success' && (
              <div className="mt-4 p-3 bg-green-600/10 border border-green-600/20 rounded-xl text-center">
                <p className="text-green-600 text-sm font-medium">🎉 Mint successful! Check your wallet.</p>
              </div>
            )}

            {mintState === 'error' && (
              <div className="mt-4 p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-center">
                <p className="text-red-600 text-sm font-medium">❌ Mint failed. Please try again.</p>
              </div>
            )}

            {/* Network Status */}
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Solana Mainnet • RPC Healthy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
