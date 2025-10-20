import { NFTRevealFeature } from '@/components/vault/nft-reveal-feature'

interface PageProps {
  params: Promise<{
    nftId: string
  }>
}

export default async function NFTRevealPage({ params }: PageProps) {
  const { nftId } = await params
  return <NFTRevealFeature nftId={nftId} />
}
