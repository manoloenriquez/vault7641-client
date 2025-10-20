'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Wallet, XCircle, Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiresNFT?: boolean
  allowedGuilds?: string[]
  fallback?: React.ReactNode
}

type AuthStatus = 'checking' | 'not-connected' | 'connected' | 'no-nft' | 'authorized' | 'guild-mismatch'

// Mock function to check NFT ownership - replace with actual implementation
async function checkNFTOwnership(walletAddress: string): Promise<{
  hasNFT: boolean
  guild?: string
  tokenId?: string
}> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock data - replace with actual Solana NFT verification
  // TODO: Replace with actual Solana NFT verification using walletAddress
  console.log('Checking NFT ownership for wallet:', walletAddress)

  const mockNFTData = {
    hasNFT: Math.random() > 0.3, // 70% chance of having NFT for demo
    guild: ['Trader/HODLers', 'DeFi & Airdrops', 'NFTs & Gaming', 'Developer', 'Careers'][
      Math.floor(Math.random() * 5)
    ],
    tokenId: 'ABC123',
  }

  return mockNFTData
}

export function AuthGuard({ children, requiresNFT = true, allowedGuilds = [], fallback }: AuthGuardProps) {
  const { publicKey, connected } = useWallet()
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking')
  const [userGuild, setUserGuild] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true)

      if (!connected || !publicKey) {
        setAuthStatus('not-connected')
        setIsLoading(false)
        return
      }

      setAuthStatus('connected')

      if (requiresNFT) {
        try {
          const nftData = await checkNFTOwnership(publicKey.toBase58())

          if (!nftData.hasNFT) {
            setAuthStatus('no-nft')
            setIsLoading(false)
            return
          }

          setUserGuild(nftData.guild || null)

          if (allowedGuilds.length > 0 && nftData.guild && !allowedGuilds.includes(nftData.guild)) {
            setAuthStatus('guild-mismatch')
            setIsLoading(false)
            return
          }

          setAuthStatus('authorized')
        } catch (error) {
          console.error('Error checking NFT ownership:', error)
          setAuthStatus('no-nft')
        }
      } else {
        setAuthStatus('authorized')
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [connected, publicKey, requiresNFT, allowedGuilds])

  if (fallback && authStatus !== 'authorized') {
    return <>{fallback}</>
  }

  // Loading state
  if (isLoading || authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Verifying Access</h2>
          <p className="text-muted-foreground">
            {!connected ? 'Checking wallet connection...' : 'Verifying membership...'}
          </p>
        </div>
      </div>
    )
  }

  // Not connected
  if (authStatus === 'not-connected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8">
            Please connect your wallet to access member-only content and features.
          </p>
          <WalletMultiButton />
        </div>
      </div>
    )
  }

  // No NFT
  if (authStatus === 'no-nft') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Membership Required</h2>
          <p className="text-muted-foreground mb-8">
            You need a Vault 7641 Base Pass NFT to access this content. Mint your pass to join the community.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Mint Base Pass
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Guild mismatch
  if (authStatus === 'guild-mismatch') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Guild Access Required</h2>
          <p className="text-muted-foreground mb-4">This content is restricted to specific guilds.</p>
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Your guild:</p>
            <Badge variant="outline" className="mb-4">
              {userGuild}
            </Badge>
            <p className="text-sm text-muted-foreground mb-2">Required guilds:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {allowedGuilds.map((guild, index) => (
                <Badge key={index} className="bg-primary/20 text-primary">
                  {guild}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="outline" size="lg">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Authorized - show the protected content
  return <>{children}</>
}

// Utility hook for getting current user's auth status
export function useAuth() {
  const { publicKey, connected } = useWallet()
  const [authData, setAuthData] = useState<{
    isAuthenticated: boolean
    hasNFT: boolean
    guild: string | null
    loading: boolean
  }>({
    isAuthenticated: false,
    hasNFT: false,
    guild: null,
    loading: true,
  })

  useEffect(() => {
    async function checkAuth() {
      if (!connected || !publicKey) {
        setAuthData({
          isAuthenticated: false,
          hasNFT: false,
          guild: null,
          loading: false,
        })
        return
      }

      try {
        const nftData = await checkNFTOwnership(publicKey.toBase58())
        setAuthData({
          isAuthenticated: connected,
          hasNFT: nftData.hasNFT,
          guild: nftData.guild || null,
          loading: false,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setAuthData({
          isAuthenticated: connected,
          hasNFT: false,
          guild: null,
          loading: false,
        })
      }
    }

    checkAuth()
  }, [connected, publicKey])

  return authData
}
