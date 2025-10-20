'use client'

import { useMemo, ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { getSolanaRpcUrl, SOLANA_CONNECTION_CONFIG } from '@/lib/solana/connection-config'

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaProvider({ children }: { children: ReactNode }) {
  // Get RPC endpoint with global configuration
  const endpoint = useMemo(() => getSolanaRpcUrl(), [])

  // Configure wallets
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  // Use global connection config for consistent commitment across the app
  const config = useMemo(() => SOLANA_CONNECTION_CONFIG, [])

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
