import { VaultHero } from '@/components/vault/vault-hero'
import { HowItWorks } from '@/components/vault/how-it-works'
import { GuildsSection } from '@/components/vault/guilds-section'
import { MemberBenefits } from '@/components/vault/member-benefits'
import { RoadmapSection } from '@/components/vault/roadmap-section'
import { SocialProof } from '@/components/vault/social-proof'
import { FAQSection } from '@/components/vault/faq-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <VaultHero />
      {/* <MintModule /> */}
      <HowItWorks />
      <GuildsSection />
      <MemberBenefits />
      <RoadmapSection />
      <SocialProof />
      <FAQSection />
    </div>
  )
}
