import { RevealResultFeature } from '@/components/vault/reveal-result-feature'

interface PageProps {
  params: {
    nftId: string
  }
}

export default function RevealResultPage({ params }: PageProps) {
  return <RevealResultFeature nftId={params.nftId} />
}
