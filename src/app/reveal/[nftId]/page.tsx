import { NFTRevealFeature } from '@/components/vault/nft-reveal-feature'
import { ErrorBoundary } from '@/components/error-boundary'

interface PageProps {
  params: Promise<{
    nftId: string
  }>
}

export default async function NFTRevealPage({ params }: PageProps) {
  const { nftId } = await params
  return (
    <ErrorBoundary>
      <NFTRevealFeature nftId={nftId} />
    </ErrorBoundary>
  )
}
