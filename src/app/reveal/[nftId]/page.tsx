import { NFTRevealFeature } from '@/components/vault/nft-reveal-feature'

interface PageProps {
  params: {
    nftId: string
  }
}

export default function NFTRevealPage({ params }: PageProps) {
  return <NFTRevealFeature nftId={params.nftId} />
}
