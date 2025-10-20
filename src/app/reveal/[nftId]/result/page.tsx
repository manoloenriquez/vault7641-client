import { RevealResultFeature } from '@/components/vault/reveal-result-feature'

interface PageProps {
  params: Promise<{
    nftId: string
  }>
}

export default async function RevealResultPage({ params }: PageProps) {
  const { nftId } = await params
  return <RevealResultFeature nftId={nftId} />
}
